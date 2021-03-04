import { __, prop } from "ramda"
import React, {
  useEffect, useState, useCallback, useMemo, memo, useContext,
} from "react"
import { ThemeContext } from "styled-components"
import { useDebouncedCallback } from "use-debounce"

import {
  requestCommonColorsAction,
  resetGlobalPanAndZoomAction,
  setDefaultAfterAction,
  resetDefaultAfterAction,
  setGlobalPanAndZoomAction,
  setGlobalSelectionAction,
} from "domains/global/actions"
import {
  createSelectAssignedColors,
  selectGlobalSelection,
  selectSyncPanAndZoom,
  selectSyncSelection,
  selectUnitsScalingMethod,
} from "domains/global/selectors"
import { useDispatch, useSelector } from "store/redux-separate-context"
import { TimeRange } from "types/common"
import { MS_IN_SECOND, isTimestamp } from "utils/utils"

import { resetChartPanAndZoomAction, setChartPanAndZoomAction } from "domains/chart/actions"

import { getPanAndZoomStep } from "../utils/get-pan-and-zoom-step"
import { Attributes } from "../utils/transformDataAttributes"
import { chartLibrariesSettings } from "../utils/chartLibrariesSettings"
import { useFormatters } from "../utils/formatters"
import { ChartData, ChartMetadata, DygraphData } from "../chart-types"

import { ChartLegend } from "./chart-legend"
import { LegendToolbox } from "./legend-toolbox"
import { ResizeHandler } from "./resize-handler"
import { AbstractChart } from "./abstract-chart"

interface GlobalPanAndZoomState {
  after: number // timestamp in ms
  before: number // timestamp in ms
  masterID?: string
  shouldForceTimeRange?: boolean
}

interface Props {
  attributes: Attributes
  chartContainerElement: HTMLElement
  chartData: ChartData
  chartMetadata: ChartMetadata
  chartHeight: number
  chartUuid: string
  chartWidth: number
  defaultAfter: number
  globalPanAndZoom: null | GlobalPanAndZoomState
  hasEmptyData: boolean
  isRemotelyControlled: boolean
  viewRangeForCurrentData: TimeRange
  viewRange: TimeRange
  selectedDimensions: string[]
  setSelectedDimensions: (newState: string[]) => void
  showLatestOnBlur: boolean
}

export const Chart = memo(({
  attributes,
  attributes: {
    chartLibrary,
  },
  chartContainerElement,
  chartData,
  chartMetadata,
  chartHeight,
  chartUuid,
  chartWidth,
  defaultAfter,
  globalPanAndZoom,
  hasEmptyData,
  isRemotelyControlled,
  viewRangeForCurrentData,
  viewRange,
  selectedDimensions,
  setSelectedDimensions,
  showLatestOnBlur,
}: Props) => {
  const themeContext = useContext(ThemeContext)
  const unitsScalingMethod = useSelector(selectUnitsScalingMethod)
  const chartSettings = chartLibrariesSettings[chartLibrary]
  const { hasLegend } = chartSettings
  const {
    units = chartMetadata.units,
    unitsCommon,
    unitsDesired = unitsScalingMethod,
  } = attributes

  // we need to have empty selectedDimensions work as {all enabled}, in case
  // new dimensions show up (when all are enabled, the new dimensions should also auto-enable)
  const dimensionsVisibility = useMemo(() => chartData.dimension_names.map(
    (dimensionName) => (selectedDimensions.length === 0
      ? true
      : selectedDimensions.includes(dimensionName)),
  ),
  [chartData.dimension_names, selectedDimensions])


  const shouldDisplayToolbox = hasLegend(attributes)
    && window.NETDATA.options.current.legend_toolbox

  const shouldDisplayResizeHandler = shouldDisplayToolbox
    && window.NETDATA.options.current.resize_charts // legacy way of turning off for print mode
    && !attributes.hideResizeHandler

  const dispatch = useDispatch()
  const allDimensionNames = useMemo(
    () => {
      // metadata and chartData dimensions match each other, but we need to first parse
      // dimensions from metadata, to keep the same order (when browser parsers dimensions object,
      // it sorts them in *some* way which is hard to reproduce). And people can get used to colors
      // so let's keep them as they were before
      const dimensionNamesFromMetadata = Object.values(chartMetadata.dimensions).map((x) => x.name)
      const additionalDimensionNamesFromData = chartData.dimension_names.filter(
        (x) => !dimensionNamesFromMetadata.includes(x),
      )
      return dimensionNamesFromMetadata.concat(additionalDimensionNamesFromData)
    },
    [chartData.dimension_names, chartMetadata.dimensions],
  )
  useEffect(() => {
    dispatch(requestCommonColorsAction({
      chartContext: chartMetadata.context,
      chartUuid,
      colorsAttribute: attributes.colors,
      commonColorsAttribute: attributes.commonColors,
      dimensionNames: allDimensionNames,
    }))
  }, [allDimensionNames, attributes.colors, attributes.commonColors, chartMetadata.context,
    chartUuid, dispatch])

  const {
    legendFormatValue,
    legendFormatValueDecimalsFromMinMax,
    unitsCurrent,
  } = useFormatters({
    attributes,
    data: chartData,
    units,
    unitsCommon,
    unitsDesired,
    uuid: chartUuid,
  })

  const [localHoveredX, setLocalHoveredX] = useState<number | null>(null)

  const isSyncSelection = useSelector(selectSyncSelection)
  const handleSetHoveredX = useCallback((newHoveredX, noMaster) => {
    if (isSyncSelection) {
      const action = noMaster
        ? { chartUuid: null, hoveredX: newHoveredX }
        : { chartUuid, hoveredX: newHoveredX }
      dispatch(setGlobalSelectionAction(action))
    } else {
      setLocalHoveredX(newHoveredX)
    }
  }, [chartUuid, dispatch, isSyncSelection])
  const globalHoveredX = useSelector(selectGlobalSelection)
  const hoveredX = isSyncSelection
    ? globalHoveredX
    : localHoveredX

  // time-frames for requested data (even when request is pending)
  const viewAfter = isTimestamp(viewRange[0]) ? viewRange[0] : chartData.after * MS_IN_SECOND
  const viewBefore = isTimestamp(viewRange[1]) ? viewRange[1] : chartData.before * MS_IN_SECOND

  const viewAfterForCurrentData = isTimestamp(viewRangeForCurrentData[0])
    ? viewRangeForCurrentData[0]
    : chartData.after * MS_IN_SECOND
  const viewBeforeForCurrentData = isTimestamp(viewRangeForCurrentData[1])
    ? viewRangeForCurrentData[1]
    : chartData.before * MS_IN_SECOND // when 'before' is 0 or negative

  const netdataFirst = chartData.first_entry * MS_IN_SECOND
  const netdataLast = chartData.last_entry * MS_IN_SECOND

  // old dashboard persists min duration based on first chartWidth, i assume it's a bug
  // and will update fixedMinDuration when width changes
  const fixedMinDuration = useMemo(() => (
    Math.round((chartWidth / 30) * chartMetadata.update_every * MS_IN_SECOND)
  ), [chartMetadata.update_every, chartWidth])

  const isSyncPanAndZoom = useSelector(selectSyncPanAndZoom)

  const setGlobalPanAndZoomDebounced = useDebouncedCallback(
    (newGlobalPanAndZoom) => {
      dispatch(setGlobalPanAndZoomAction(newGlobalPanAndZoom))
    },
    400, // corresponds to global_pan_sync_time in old dashboard
  )

  const immediatelyDispatchPanAndZoom = useCallback(() => {
    setGlobalPanAndZoomDebounced.flush()
  }, [setGlobalPanAndZoomDebounced])

  /**
   * pan-and-zoom handler (both for toolbox and mouse events)
   */
  const handleUpdateChartPanAndZoom = useCallback(({
    after,
    before,
    callback,
    shouldFlushImmediately = false,
    shouldForceTimeRange,
    shouldNotExceedAvailableRange,
  }) => {
    if (before < after) {
      return
    }
    let minDuration = fixedMinDuration

    const currentDuraton = Math.round(viewBefore - viewAfter)

    let afterForced = Math.round(after)
    let beforeForced = Math.round(before)
    const viewUpdateEvery = chartData.view_update_every * MS_IN_SECOND

    if (shouldNotExceedAvailableRange) {
      const first = netdataFirst + viewUpdateEvery
      const last = netdataLast + viewUpdateEvery
      // first check "before"
      if (beforeForced > last) {
        afterForced -= (before - last)
        beforeForced = last
      }

      if (afterForced < first) {
        afterForced = first
      }
    }


    // align them to update_every
    // stretching them further away
    afterForced -= afterForced % (viewUpdateEvery)
    beforeForced += viewUpdateEvery - (beforeForced % viewUpdateEvery)

    // the final wanted duration
    let wantedDuration = beforeForced - afterForced

    // to allow panning, accept just a point below our minimum
    if ((currentDuraton - viewUpdateEvery) < minDuration) {
      minDuration = currentDuraton - viewUpdateEvery
    }

    // we do it, but we adjust to minimum size and return false
    // when the wanted size is below the current and the minimum
    // and we zoom
    let doCallback = true
    if (wantedDuration < currentDuraton && wantedDuration < minDuration) {
      minDuration = fixedMinDuration

      const dt = (minDuration - wantedDuration) / 2
      beforeForced += dt
      afterForced -= dt
      wantedDuration = beforeForced - afterForced
      doCallback = false
    }

    const tolerance = viewUpdateEvery * 2
    const movement = Math.abs(beforeForced - viewBefore)

    if (
      Math.abs(currentDuraton - wantedDuration) <= tolerance && movement <= tolerance && doCallback
    ) {
      return
    }

    if (isSyncPanAndZoom) {
      setGlobalPanAndZoomDebounced.callback({
        after: afterForced,
        before: beforeForced,
        masterID: chartUuid,
        shouldForceTimeRange,
      })
      if (shouldFlushImmediately) {
        setGlobalPanAndZoomDebounced.flush()
      }
    } else {
      dispatch(setChartPanAndZoomAction({
        after: afterForced,
        before: beforeForced,
        id: chartUuid,
        shouldForceTimeRange,
      }))
    }

    if (doCallback && typeof callback === "function") {
      callback(afterForced, beforeForced)
    }
  }, [chartData.view_update_every, chartUuid, dispatch, fixedMinDuration, isSyncPanAndZoom,
    netdataFirst, netdataLast, setGlobalPanAndZoomDebounced, viewAfter, viewBefore])

  /**
   * toolbox handlers
   */
  const handleToolBoxPanAndZoom = useCallback((after: number, before: number) => {
    const newAfter = Math.max(after, netdataFirst)
    const newBefore = Math.min(before, netdataLast)
    handleUpdateChartPanAndZoom({
      after: newAfter,
      before: newBefore,
      shouldForceTimeRange: true,
      shouldFlushImmediately: true,
    })
  }, [handleUpdateChartPanAndZoom, netdataFirst, netdataLast])

  const handleToolboxLeftClick = useCallback((event: React.MouseEvent) => {
    const step = (viewBefore - viewAfter) * getPanAndZoomStep(event)
    const newBefore = viewBefore - step
    const newAfter = viewAfter - step
    if (newAfter >= netdataFirst) {
      handleToolBoxPanAndZoom(newAfter, newBefore)
    }
  }, [handleToolBoxPanAndZoom, netdataFirst, viewAfter, viewBefore])

  const handleToolboxRightClick = useCallback((event: React.MouseEvent) => {
    const timeWindow = viewBefore - viewAfter
    const step = timeWindow * getPanAndZoomStep(event)
    const newBefore = Math.min(viewBefore + step, netdataLast)
    const newAfter = newBefore - timeWindow
    handleToolBoxPanAndZoom(newAfter, newBefore)
  }, [handleToolBoxPanAndZoom, netdataLast, viewAfter, viewBefore])

  const handleToolboxZoomInClick = useCallback((event: React.MouseEvent) => {
    const panAndZoomStep = getPanAndZoomStep(event) * 0.8
    if (!globalPanAndZoom) {
      dispatch(setDefaultAfterAction({
        after: Math.round(defaultAfter / (panAndZoomStep + 1)),
      }))
      return
    }
    // if visible time range is much bigger than available time range in history, first zoom-in
    // should just fit to available range
    if ((viewBefore - viewAfter) > (netdataLast - netdataFirst) * 1.2) {
      handleToolBoxPanAndZoom(netdataFirst, netdataLast)
      return
    }
    const dt = ((viewBefore - viewAfter) * panAndZoomStep) / 2
    const newAfter = viewAfter + dt
    const newBefore = viewBefore - dt
    handleToolBoxPanAndZoom(newAfter, newBefore)
  }, [defaultAfter, dispatch, globalPanAndZoom, handleToolBoxPanAndZoom, netdataFirst, netdataLast,
    viewAfter, viewBefore])

  const handleToolboxZoomOutClick = useCallback((event: React.MouseEvent) => {
    const panAndZoomStep = getPanAndZoomStep(event) * 0.8
    if (!globalPanAndZoom) {
      dispatch(setDefaultAfterAction({
        after: Math.round(defaultAfter * (panAndZoomStep + 1)),
      }))
      return
    }
    const dt = ((viewBefore - viewAfter) / (1.0 - (panAndZoomStep * 0.8))
      - (viewBefore - viewAfter)) / 2
    const newAfter = viewAfter - dt
    const newBefore = viewBefore + dt
    handleToolBoxPanAndZoom(newAfter, newBefore)
  }, [defaultAfter, dispatch, globalPanAndZoom, handleToolBoxPanAndZoom, viewAfter, viewBefore])

  const handleToolboxResetClick = useCallback(() => {
    if (isSyncPanAndZoom) {
      if (globalPanAndZoom) {
        dispatch(resetGlobalPanAndZoomAction())
      } else {
        dispatch(resetDefaultAfterAction())
      }
    } else {
      dispatch(resetChartPanAndZoomAction({ id: chartUuid }))
    }
  }, [chartUuid, dispatch, globalPanAndZoom, isSyncPanAndZoom])

  /**
   * assign colors
   */
  const selectAssignedColors = useMemo(() => createSelectAssignedColors({
    chartContext: chartMetadata.context,
    chartUuid,
    colorsAttribute: attributes.colors,
    commonColorsAttribute: attributes.commonColors,
  }), [attributes.colors, attributes.commonColors, chartMetadata, chartUuid])
  const colors = useSelector(selectAssignedColors)
  const orderedColors = useMemo(
    () => chartData.dimension_names.map(prop(__, colors)),
    [chartData, colors],
  )

  if (!colors) {
    return <span /> // wait for createSelectAssignedColors reducer result to come back
  }

  const isTimeVisible = hoveredX && hoveredX >= viewAfter && hoveredX <= viewBefore
  const viewUpdateEvery = chartData.view_update_every * MS_IN_SECOND
  const hoveredRow = isTimeVisible
    ? Math.floor(((hoveredX as number) - chartData.after * MS_IN_SECOND) / viewUpdateEvery)
    : -1

  const isLegendOnBottom = attributes.legendPosition === "bottom"

  const legendToolbox = (
    <LegendToolbox
      onToolboxLeftClick={handleToolboxLeftClick}
      onToolboxResetClick={handleToolboxResetClick}
      onToolboxRightClick={handleToolboxRightClick}
      onToolboxZoomInClick={handleToolboxZoomInClick}
      onToolboxZoomOutClick={handleToolboxZoomOutClick}
    />
  )

  const resizeHandler = shouldDisplayResizeHandler && (
    <ResizeHandler
      chartContainerElement={chartContainerElement}
      chartUuid={chartUuid}
      heightId={attributes.heightId}
      isLegendOnBottom={isLegendOnBottom}
    />
  )

  return (
    <>
      <AbstractChart
        // remount on theme change
        key={themeContext.name}
        attributes={attributes}
        chartContainerElement={chartContainerElement}
        chartData={chartData}
        chartMetadata={chartMetadata}
        chartLibrary={chartLibrary}
        colors={colors}
        chartUuid={chartUuid}
        chartHeight={chartHeight}
        chartWidth={chartWidth}
        dimensionsVisibility={dimensionsVisibility}
        hasEmptyData={hasEmptyData}
        onUpdateChartPanAndZoom={handleUpdateChartPanAndZoom}
        immediatelyDispatchPanAndZoom={immediatelyDispatchPanAndZoom}
        isRemotelyControlled={isRemotelyControlled}
        legendFormatValue={legendFormatValue}
        orderedColors={orderedColors}
        hoveredX={hoveredX}
        hoveredRow={hoveredRow}
        setHoveredX={handleSetHoveredX}
        setMinMax={([min, max]) => legendFormatValueDecimalsFromMinMax(min, max)}
        showLatestOnBlur={showLatestOnBlur}
        unitsCurrent={unitsCurrent}
        viewAfterForCurrentData={viewAfterForCurrentData}
        viewBeforeForCurrentData={viewBeforeForCurrentData}
      />
      {hasLegend(attributes) && (
        <ChartLegend
          attributes={attributes}
          chartData={chartData as DygraphData}
          chartMetadata={chartMetadata}
          chartLibrary={chartLibrary}
          colors={colors}
          hoveredX={hoveredX}
          hoveredRow={hoveredRow}
          legendFormatValue={legendFormatValue}
          selectedDimensions={selectedDimensions}
          setSelectedDimensions={setSelectedDimensions}
          showLatestOnBlur={showLatestOnBlur}
          unitsCurrent={unitsCurrent}
          viewBefore={viewBefore}
          legendToolbox={legendToolbox}
          resizeHandler={resizeHandler}
        />
      )}
      {shouldDisplayToolbox && !isLegendOnBottom && (
        legendToolbox
      )}
      {!isLegendOnBottom && (
        resizeHandler
      )}
    </>
  )
})
