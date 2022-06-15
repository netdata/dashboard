import { cond, always, T } from "ramda"
import axios from "axios"
import React, { useEffect, useState, useMemo, useLayoutEffect } from "react"
import { useThrottle, useUpdateEffect, useUnmount, useDebounce } from "react-use"

import { AppStateT } from "store/app-state"
import { useSelector, useDispatch } from "store/redux-separate-context"

import {
  selectGlobalPanAndZoom,
  selectGlobalSelection,
  selectShouldEliminateZeroDimensions,
  selectPanAndZoomDataPadding,
  selectSnapshot,
  selectSpacePanelTransitionEndIsActive,
  selectDefaultAfter,
} from "domains/global/selectors"
import { serverDefault } from "utils/server-detection"
import { CHART_UNMOUNTED } from "utils/netdata-sdk"
import { getCorrectedPoints } from "utils/fill-missing-data"

import { fallbackUpdateTimeInterval, panAndZoomDelay } from "../../constants"
import { getChartURLOptions } from "../../utils/get-chart-url-options"
import { chartLibrariesSettings } from "../../utils/chartLibrariesSettings"
import { Attributes } from "../../utils/transformDataAttributes"
import { getChartPixelsPerPoint } from "../../utils/get-chart-pixels-per-point"
import { useFetchNewDataClock } from "../../hooks/use-fetch-new-data-clock"

import { fetchChartAction, fetchDataAction } from "../../actions"
import {
  selectChartData,
  selectChartFetchDataParams,
  makeSelectChartMetadataRequest,
  selectChartPanAndZoom,
  selectChartIsFetchingData,
  selectChartViewRange,
} from "../../selectors"
import {
  ChartData,
  ChartMetadata,
  D3pieChartData,
  DygraphData,
  EasyPieChartData,
} from "../../chart-types"

import { Loader } from "../loader"
import { Chart } from "../chart"
import { ChartDropdown, DropdownMenu } from "../chart-dropdown"
import { ChartSpinner } from "../chart-spinner/chart-spinner"

import * as S from "./styled"
import "./chart-with-loader.css"

export type RenderCustomElementForDygraph = (selectedChartConfiguration: {
  attributes: Attributes
  onAttributesChange: any
  chartMetadata: ChartMetadata
  chartID: string
  chartData: ChartData | null
}) => JSX.Element

const dimensionsAggrMethodMap = {
  "sum-of-abs": "sum",
}

const emptyArray = [] as any

export type Props = {
  attributes: Attributes
  chartUuid: string
  uuid?: string
  dropdownMenu?: DropdownMenu
  externalChartMetadata?: ChartMetadata
  portalNode: HTMLElement
  renderCustomElementForDygraph?: RenderCustomElementForDygraph
  onAttributesChange?: any
}

export const ChartWithLoader = ({
  attributes,
  chartUuid,
  uuid,
  dropdownMenu,
  externalChartMetadata,
  portalNode,
  renderCustomElementForDygraph,
  onAttributesChange,
}: Props) => {
  /**
   * fetch chart details
   */
  const { host = serverDefault, id, nodeIDs } = attributes
  const dispatch = useDispatch()
  const selectChartMetadataRequest = useMemo(makeSelectChartMetadataRequest, [])
  const { chartMetadata, isFetchingDetails } = useSelector((state: AppStateT) =>
    selectChartMetadataRequest(state, { chartId: id, id: chartUuid })
  )
  const actualChartMetadata = externalChartMetadata || chartMetadata
  useEffect(() => {
    if (!chartMetadata && !isFetchingDetails && !externalChartMetadata) {
      dispatch(
        fetchChartAction.request({
          chart: id,
          id: chartUuid,
          host,
          nodeIDs,
        })
      )
    }
  }, [
    id,
    chartUuid,
    dispatch,
    host,
    isFetchingDetails,
    chartMetadata,
    externalChartMetadata,
    nodeIDs,
    uuid,
  ])

  // todo local state option
  const globalPanAndZoom = useSelector(selectGlobalPanAndZoom)
  const chartPanAndZoom = useSelector((state: AppStateT) =>
    selectChartPanAndZoom(state, { id: chartUuid })
  )
  const panAndZoom = chartPanAndZoom || globalPanAndZoom

  const isPanAndZoomMaster =
    (!!globalPanAndZoom && globalPanAndZoom.masterID === chartUuid) || Boolean(chartPanAndZoom)
  const shouldForceTimeRange = panAndZoom?.shouldForceTimeRange || false

  // (isRemotelyControlled === false) only during globalPanAndZoom, when chart is panAndZoomMaster
  // and when no toolbox is used at that time
  const isRemotelyControlled = !panAndZoom || !isPanAndZoomMaster || shouldForceTimeRange // used when zooming/shifting in toolbox

  const fetchDataParams = useSelector((state: AppStateT) =>
    selectChartFetchDataParams(state, { id: chartUuid })
  )
  const viewRange = useSelector((state: AppStateT) =>
    selectChartViewRange(state, { id: chartUuid })
  )
  const chartData = useSelector((state: AppStateT) => selectChartData(state, { id: chartUuid }))
  const isFetchingData = useSelector((state: AppStateT) =>
    selectChartIsFetchingData(state, { id: chartUuid })
  )

  const hoveredX = useSelector(selectGlobalSelection)

  // periodical update of newest data
  // default to 2000ms. When chartMetadata has been fetched, use chartMetadata.update_every
  // if chartData has been fetched, use chartData.view_update_every instead
  // todo add support to "data-update-every" attribute
  const viewUpdateEvery = cond([
    [always(!!chartData), () => (chartData as ChartData).view_update_every * 1000],
    [
      always(!!actualChartMetadata),
      () => (actualChartMetadata as ChartMetadata).update_every * 1000,
    ],
    [T, always(fallbackUpdateTimeInterval)],
  ])()
  const [shouldFetch, setShouldFetch] = useFetchNewDataClock({
    areCriteriaMet: !panAndZoom && !hoveredX,
    preferedIntervalTime: viewUpdateEvery,
  })

  const panAndZoomThrottled = useThrottle(panAndZoom, panAndZoomDelay)
  useEffect(() => {
    setShouldFetch(true)
  }, [panAndZoomThrottled, setShouldFetch])

  const defaultAfter = useSelector(selectDefaultAfter)
  // when after/before changes, don't wait for next interval, just fetch immediately
  useUpdateEffect(() => {
    setShouldFetch(true)
  }, [
    attributes.after,
    attributes.before,
    defaultAfter,
    attributes.dimensions,
    attributes.aggrMethod,
    attributes.groupBy,
  ])

  const { before: initialBefore = window.NETDATA.chartDefaults.before } = attributes

  // attributes.after should be now used only for old custom dashboard
  // and in the future for setting timeframe per-chart
  const liveModeAfter = attributes.after || defaultAfter

  const chartSettings = chartLibrariesSettings[attributes.chartLibrary]
  const { hasLegend } = chartSettings

  // todo optimize by using resizeObserver (optionally)
  const boundingClientRect = portalNode.getBoundingClientRect()

  // from old dashboard
  const chartWidth = boundingClientRect.width - (hasLegend(attributes) ? 140 : 0)
  const chartHeight = boundingClientRect.height

  const isShowingSnapshot = Boolean(useSelector(selectSnapshot))
  const shouldEliminateZeroDimensions =
    useSelector(selectShouldEliminateZeroDimensions) || isShowingSnapshot
  const shouldUsePanAndZoomPadding = useSelector(selectPanAndZoomDataPadding)

  const { CancelToken } = axios
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const cancelTokenSource = useMemo(() => CancelToken.source(), [])
  useUnmount(() => {
    cancelTokenSource.cancel(CHART_UNMOUNTED)
  })

  /**
   * spinner state
   * show spinner when it's fetching for more than 2 seconds
   * hide spinner immediately when it's not fetching
   */
  const [shouldShowSpinnerDebounced, setShouldShowSpinnerDebounced] = useState(false)
  const shouldShowSpinner = shouldShowSpinnerDebounced && isFetchingData
  useDebounce(
    () => {
      if (isFetchingData) {
        setShouldShowSpinnerDebounced(true)
      }
    },
    2000,
    [isFetchingData]
  )
  useEffect(() => {
    if (!isFetchingData && shouldShowSpinnerDebounced) {
      setShouldShowSpinnerDebounced(false)
    }
  }, [isFetchingData, shouldShowSpinnerDebounced])

  /**
   * fetch data
   */
  useEffect(() => {
    if (shouldFetch && actualChartMetadata && !isFetchingData) {
      // todo can be overridden by main.js
      const forceDataPoints = window.NETDATA.options.force_data_points

      let after
      let before
      let newViewRange
      let pointsMultiplier = 1

      if (panAndZoom) {
        if (isPanAndZoomMaster) {
          after = Math.round(panAndZoom.after / 1000)
          before = Math.round(panAndZoom.before / 1000)

          newViewRange = [after, before]

          if (shouldUsePanAndZoomPadding) {
            const requestedPadding = Math.round((before - after) / 2)
            after -= requestedPadding
            before += requestedPadding
            pointsMultiplier = 2
          }
        } else {
          after = Math.round(panAndZoom.after / 1000)
          before = Math.round(panAndZoom.before / 1000)
          pointsMultiplier = 1
        }
      } else {
        // no panAndZoom
        before = initialBefore
        after = liveModeAfter
        pointsMultiplier = 1
      }

      newViewRange = (newViewRange || [after, before]).map(x => x * 1000) as [number, number]

      const dataPoints =
        attributes.points ||
        Math.round(chartWidth / getChartPixelsPerPoint({ attributes, chartSettings }))
      const points = forceDataPoints || dataPoints * pointsMultiplier

      const shouldForceTimeWindow = attributes.forceTimeWindow || Boolean(defaultAfter)
      // if we want to add fake points, we need first need to request less
      // to have the desired frequency
      // this will be removed when Agents will support forcing time-window between points
      const correctedPoints = shouldForceTimeWindow
        ? getCorrectedPoints({
            after,
            before,
            firstEntry: actualChartMetadata.first_entry,
            points,
          })
        : null

      const group = attributes.method || window.NETDATA.chartDefaults.method
      setShouldFetch(false)
      dispatch(
        fetchDataAction.request({
          // properties to be passed to API
          host,
          context: actualChartMetadata.context,
          chart: actualChartMetadata.id,
          format: chartSettings.format,
          points: correctedPoints || points,
          group,
          gtime: attributes.gtime || 0,
          options: getChartURLOptions(attributes, shouldEliminateZeroDimensions),
          after: after || null,
          before: before || null,
          dimensions: attributes.dimensions,
          labels: attributes.labels,
          postGroupBy: attributes.postGroupBy,
          postAggregationMethod: attributes.postAggregationMethod,
          aggrMethod: attributes.aggrMethod,
          aggrGroups: attributes.aggrGroups,
          // @ts-ignore
          dimensionsAggrMethod:
            dimensionsAggrMethodMap[attributes.dimensionsAggrMethod] ||
            attributes.dimensionsAggrMethod,
          nodeIDs,
          httpMethod: attributes.httpMethod,
          groupBy: attributes.groupBy,

          // properties for the reducer
          fetchDataParams: {
            // we store it here so it is only available when data is fetched
            // those params should be synced with data
            fillMissingPoints: correctedPoints ? points - correctedPoints : undefined,
            isRemotelyControlled,
            viewRange: newViewRange,
          },
          id: chartUuid,
          cancelTokenSource,
        })
      )
    }
  }, [
    attributes,
    actualChartMetadata,
    chartSettings,
    chartUuid,
    chartWidth,
    defaultAfter,
    dispatch,
    hasLegend,
    host,
    initialBefore,
    isFetchingData,
    isPanAndZoomMaster,
    isRemotelyControlled,
    liveModeAfter,
    panAndZoom,
    portalNode,
    setShouldFetch,
    shouldEliminateZeroDimensions,
    shouldUsePanAndZoomPadding,
    shouldFetch,
    cancelTokenSource,
    nodeIDs,
    uuid,
  ])

  useSelector(selectSpacePanelTransitionEndIsActive)

  const externalSelectedDimensions = attributes?.selectedDimensions
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>(
    externalSelectedDimensions || emptyArray
  )

  useLayoutEffect(() => {
    if (externalSelectedDimensions) {
      setSelectedDimensions(externalSelectedDimensions)
    }
  }, [externalSelectedDimensions])

  useLayoutEffect(() => {
    setSelectedDimensions(externalSelectedDimensions || emptyArray)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributes?.groupBy])

  const customElementForDygraph = useMemo(
    () =>
      renderCustomElementForDygraph &&
      renderCustomElementForDygraph({
        onAttributesChange,
        attributes,
        chartMetadata: actualChartMetadata as ChartMetadata,
        chartData,
        chartID: id,
      }),
    [
      onAttributesChange,
      renderCustomElementForDygraph,
      attributes,
      id,
      actualChartMetadata,
      chartData,
    ]
  )

  // eslint-disable-next-line max-len
  const hasEmptyData =
    (chartData as DygraphData | D3pieChartData | null)?.result?.data?.length === 0 ||
    (chartData as EasyPieChartData | null)?.result?.length === 0

  if (!chartData || !actualChartMetadata) {
    return (
      <>
        <Loader
          // Loader should remount when that flag is changed, because inside
          // there's an oldschool bootstrap icon which doesn't handle updates well
          key={`${hasEmptyData}`}
          hasEmptyData={hasEmptyData}
          containerNode={portalNode}
        />
        {shouldShowSpinner && <ChartSpinner chartLibrary={attributes.chartLibrary} />}
      </>
    )
  }

  return (
    <>
      {hasEmptyData && (
        <Loader key={`${hasEmptyData}`} hasEmptyData={hasEmptyData} containerNode={portalNode} />
      )}
      <Chart
        attributes={attributes}
        chartContainerElement={portalNode}
        chartData={chartData}
        chartMetadata={actualChartMetadata}
        chartUuid={chartUuid}
        chartHeight={chartHeight}
        chartWidth={chartWidth}
        defaultAfter={defaultAfter}
        globalPanAndZoom={globalPanAndZoom}
        hasEmptyData={hasEmptyData}
        isRemotelyControlled={fetchDataParams.isRemotelyControlled}
        // view range that updates only when data is fetched
        viewRangeForCurrentData={fetchDataParams.viewRange}
        // view range that updates when requesting and fetching of data
        viewRange={viewRange!}
        selectedDimensions={selectedDimensions}
        setSelectedDimensions={setSelectedDimensions}
        showLatestOnBlur={!panAndZoom}
      />
      {shouldShowSpinner && <ChartSpinner chartLibrary={attributes.chartLibrary} />}
      {dropdownMenu && dropdownMenu.length > 0 && (
        <S.ChartDropdownContainer>
          <ChartDropdown
            dropdownMenu={dropdownMenu}
            chartID={id}
            attributes={attributes}
            chartMetadata={actualChartMetadata}
          />
        </S.ChartDropdownContainer>
      )}
      {customElementForDygraph}
    </>
  )
}
