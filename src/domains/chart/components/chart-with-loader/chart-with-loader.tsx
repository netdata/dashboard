import { cond, always, T } from "ramda"
import axios from "axios"
import React, { useEffect, useState, useMemo } from "react"
import { useThrottle, useUpdateEffect, useUnmount } from "react-use"

import { AppStateT } from "store/app-state"
import { useSelector, useDispatch } from "store/redux-separate-context"

import {
  selectGlobalPanAndZoom,
  selectGlobalSelection,
  selectShouldEliminateZeroDimensions,
  selectPanAndZoomDataPadding,
  selectSnapshot,
  selectSpacePanelTransitionEndIsActive,
} from "domains/global/selectors"
import { serverDefault } from "utils/server-detection"
import { CHART_UNMOUNTED } from "utils/netdata-sdk"

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

import * as S from "./styled"
import "./chart-with-loader.css"

export type RenderCustomElementForDygraph = (selectedChartConfiguration: {
  attributes: Attributes,
  chartMetadata: ChartMetadata,
  chartID: string,
}) => JSX.Element

export type Props = {
  attributes: Attributes
  chartUuid: string
  dropdownMenu?: DropdownMenu
  externalChartMetadata?: ChartMetadata
  portalNode: HTMLElement
  renderCustomElementForDygraph?: RenderCustomElementForDygraph
}

export const ChartWithLoader = ({
  attributes,
  chartUuid,
  dropdownMenu,
  externalChartMetadata,
  portalNode,
  renderCustomElementForDygraph,
}: Props) => {
  /**
   * fetch chart details
   */
  const host = attributes.host || serverDefault
  const dispatch = useDispatch()
  const selectChartMetadataRequest = useMemo(makeSelectChartMetadataRequest, [])
  const { chartMetadata, isFetchingDetails } = useSelector((state: AppStateT) => (
    selectChartMetadataRequest(state, { chartId: attributes.id, id: chartUuid })
  ))
  const actualChartMetadata = externalChartMetadata || chartMetadata
  useEffect(() => {
    if (!chartMetadata && !isFetchingDetails && !externalChartMetadata) {
      dispatch(
        fetchChartAction.request({
          chart: attributes.id,
          id: chartUuid,
          host,
        }),
      )
    }
  }, [
    attributes.id,
    chartUuid,
    dispatch,
    host,
    isFetchingDetails,
    chartMetadata,
    externalChartMetadata,
  ])

  // todo local state option
  const globalPanAndZoom = useSelector(selectGlobalPanAndZoom)
  const chartPanAndZoom = useSelector((state: AppStateT) => (
    selectChartPanAndZoom(state, { id: chartUuid })
  ))
  const panAndZoom = chartPanAndZoom || globalPanAndZoom

  const isPanAndZoomMaster = (!!globalPanAndZoom && globalPanAndZoom.masterID === chartUuid)
    || Boolean(chartPanAndZoom)
  const shouldForceTimeRange = panAndZoom?.shouldForceTimeRange || false

  // (isRemotelyControlled === false) only during globalPanAndZoom, when chart is panAndZoomMaster
  // and when no toolbox is used at that time
  const isRemotelyControlled = !panAndZoom
    || !isPanAndZoomMaster
    || shouldForceTimeRange // used when zooming/shifting in toolbox


  const fetchDataParams = useSelector((state: AppStateT) => selectChartFetchDataParams(
    state, { id: chartUuid },
  ))
  const chartData = useSelector((state: AppStateT) => selectChartData(state, { id: chartUuid }))
  const isFetchingData = useSelector((state: AppStateT) => selectChartIsFetchingData(
    state,
    { id: chartUuid },
  ))

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

  // when after/before changes, don't wait for next interval, just fetch immediately
  useUpdateEffect(() => {
    setShouldFetch(true)
  }, [attributes.after, attributes.before])

  const {
    after: initialAfter = window.NETDATA.chartDefaults.after,
    before: initialBefore = window.NETDATA.chartDefaults.before,
  } = attributes

  const chartSettings = chartLibrariesSettings[attributes.chartLibrary]
  const { hasLegend } = chartSettings

  // todo optimize by using resizeObserver (optionally)
  const boundingClientRect = portalNode.getBoundingClientRect()

  // from old dashboard
  const chartWidth = boundingClientRect.width - (hasLegend(attributes) ? 140 : 0)
  const chartHeight = boundingClientRect.height

  const isShowingSnapshot = Boolean(useSelector(selectSnapshot))
  const shouldEliminateZeroDimensions = useSelector(selectShouldEliminateZeroDimensions)
    || isShowingSnapshot
  const shouldUsePanAndZoomPadding = useSelector(selectPanAndZoomDataPadding)

  const { CancelToken } = axios
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const cancelTokenSource = useMemo(() => CancelToken.source(), [])
  useUnmount(() => {
    cancelTokenSource.cancel(CHART_UNMOUNTED)
  })

  /**
   * fetch data
   */
  useEffect(() => {
    if (shouldFetch && actualChartMetadata && !isFetchingData) {
      // todo can be overriden by main.js
      const forceDataPoints = window.NETDATA.options.force_data_points

      let after
      let before
      let viewRange
      let pointsMultiplier = 1

      if (panAndZoom) {
        if (isPanAndZoomMaster) {
          after = Math.round(panAndZoom.after / 1000)
          before = Math.round(panAndZoom.before / 1000)

          viewRange = [after, before]

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
        after = initialAfter
        pointsMultiplier = 1
      }

      viewRange = (viewRange || [after, before]).map((x) => x * 1000) as [number, number]

      const dataPoints = attributes.points
        || Math.round(chartWidth / getChartPixelsPerPoint({ attributes, chartSettings }))
      const points = forceDataPoints || dataPoints * pointsMultiplier

      const group = attributes.method || window.NETDATA.chartDefaults.method

      setShouldFetch(false)
      dispatch(
        fetchDataAction.request({
          // properties to be passed to API
          host,
          chart: actualChartMetadata.id,
          format: chartSettings.format,
          points,
          group,
          gtime: attributes.gtime || 0,
          options: getChartURLOptions(attributes, shouldEliminateZeroDimensions),
          after: after || null,
          before: before || null,
          dimensions: attributes.dimensions,

          // properties for the reducer
          fetchDataParams: {
            // we store it here so it is only available when data is fetched
            // those params should be synced with data
            isRemotelyControlled,
            viewRange,
          },
          id: chartUuid,
          cancelTokenSource,
        }),
      )
    }
  }, [
    attributes,
    actualChartMetadata,
    chartSettings,
    chartUuid,
    chartWidth,
    dispatch,
    hasLegend,
    host,
    initialAfter,
    initialBefore,
    isFetchingData,
    isPanAndZoomMaster,
    isRemotelyControlled,
    panAndZoom,
    portalNode,
    setShouldFetch,
    shouldEliminateZeroDimensions,
    shouldUsePanAndZoomPadding,
    shouldFetch,
    cancelTokenSource,
  ])

  useSelector(selectSpacePanelTransitionEndIsActive)

  // Will require to show score somewhere in the chart legend
  const selectedDimensionsMapped = attributes?.selectedDimensions?.map((dim) => dim.name) || []
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>(selectedDimensionsMapped)

  const customElementForDygraph = useMemo(
    () => renderCustomElementForDygraph && renderCustomElementForDygraph({
      attributes,
      chartMetadata: actualChartMetadata as ChartMetadata,
      chartID: attributes.id,
    }), [renderCustomElementForDygraph, attributes, actualChartMetadata],
  )

  // eslint-disable-next-line max-len
  const hasEmptyData = (chartData as DygraphData | D3pieChartData | null)?.result?.data?.length === 0
    || (chartData as EasyPieChartData | null)?.result?.length === 0

  if (!chartData || !actualChartMetadata) {
    return (
      <Loader
        // Loader should remount when that flag is changed, because inside
        // there's an oldschool bootstrap icon which doesn't handle updates well
        key={`${hasEmptyData}`}
        hasEmptyData={hasEmptyData}
        containerNode={portalNode}
      />
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
        hasEmptyData={hasEmptyData}
        isRemotelyControlled={fetchDataParams.isRemotelyControlled}
        requestedViewRange={fetchDataParams.viewRange}
        selectedDimensions={selectedDimensions}
        setSelectedDimensions={setSelectedDimensions}
        showLatestOnBlur={!panAndZoom}
      />
      {dropdownMenu && (dropdownMenu.length > 0) && (
        <S.ChartDropdownContainer>
          <ChartDropdown
            dropdownMenu={dropdownMenu}
            chartID={attributes.id}
            attributes={attributes}
            chartMetadata={actualChartMetadata}
          />
        </S.ChartDropdownContainer>
      )}
      {customElementForDygraph}
    </>
  )
}
