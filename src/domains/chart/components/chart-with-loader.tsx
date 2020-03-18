import {
  cond, always, T,
} from "ramda"
import React, { useEffect, useState } from "react"
import { useThrottle } from "react-use"
import { AppStateT } from "store/app-state"
import { useSelector, useDispatch } from "store/redux-separate-context"
import {
  selectGlobalPanAndZoom,
  selectGlobalSelection,
  selectShouldEliminateZeroDimensions,
  selectPanAndZoomDataPadding,
  selectSnapshot,
} from "domains/global/selectors"
import { serverDefault } from "utils/server-detection"
import { fallbackUpdateTimeInterval, panAndZoomDelay } from "../constants"
import { getChartURLOptions } from "../utils/get-chart-url-options"
import { chartLibrariesSettings } from "../utils/chartLibrariesSettings"
import { Attributes } from "../utils/transformDataAttributes"
import { getChartPixelsPerPoint } from "../utils/get-chart-pixels-per-point"
import { useFetchNewDataClock } from "../hooks/use-fetch-new-data-clock"
import { fetchChartAction, fetchDataAction } from "../actions"
import {
  selectChartData,
  selectChartFetchDataParams,
  selectChartPanAndZoom,
} from "../selectors"
import {
  ChartData,
  ChartMetadata,
  D3pieChartData,
  DygraphData,
  EasyPieChartData,
} from "../chart-types"
import { Loader } from "./loader"
import { Chart } from "./chart"
import "./chart-with-loader.css"


export type Props = {
  attributes: Attributes
  chartUuid: string
  portalNode: HTMLElement
  chartMetadata?: ChartMetadata
}

export const ChartWithLoader = ({
  attributes,
  chartUuid,
  portalNode,
  chartMetadata,
}: Props) => {
  /**
   * fetch chart details
   */
  const host = attributes.host || serverDefault
  const dispatch = useDispatch()
  useEffect(() => {
    if (!chartMetadata) {
      dispatch(fetchChartAction.request({
        chart: attributes.id,
        id: chartUuid,
        host,
      }))
    }
  }, [attributes.id, chartMetadata, chartUuid, dispatch, host])


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

  const hoveredX = useSelector(selectGlobalSelection)

  // periodical update of newest data
  // default to 2000ms. When chartMetadata has been fetched, use chartMetadata.update_every
  // if chartData has been fetched, use chartData.view_update_every instead
  // todo add support to "data-update-every" attribute
  const viewUpdateEvery = cond([
    [always(!!chartData), () => (chartData as ChartData).view_update_every * 1000],
    [always(!!chartMetadata), () => (chartMetadata as ChartMetadata).update_every * 1000],
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

  const {
    after: initialAfter = window.NETDATA.chartDefaults.after,
    before: initialBefore = window.NETDATA.chartDefaults.before,
  } = attributes

  const chartSettings = chartLibrariesSettings[attributes.chartLibrary]
  const { hasLegend } = chartSettings

  // todo optimize by using resizeObserver (optionally)
  const boundingClientRect = portalNode.getBoundingClientRect()
  const chartWidth = boundingClientRect.width
    - (hasLegend(attributes) ? 140 : 0) // from old dashboard
  const chartHeight = boundingClientRect.height

  const isShowingSnapshot = Boolean(useSelector(selectSnapshot))
  const shouldEliminateZeroDimensions = useSelector(selectShouldEliminateZeroDimensions)
    || isShowingSnapshot
  const shouldUsePanAndZoomPadding = useSelector(selectPanAndZoomDataPadding)
  /**
   * fetch data
   */
  useEffect(() => {
    if (shouldFetch && chartMetadata) {
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

      viewRange = ((viewRange || [after, before]).map((x) => x * 1000)) as [number, number]

      const dataPoints = attributes.points
        || (Math.round(chartWidth / getChartPixelsPerPoint({ attributes, chartSettings })))
      const points = forceDataPoints || (dataPoints * pointsMultiplier)

      const group = attributes.method || window.NETDATA.chartDefaults.method

      setShouldFetch(false)
      dispatch(fetchDataAction.request({
        // properties to be passed to API
        host,
        chart: chartMetadata.id,
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
      }))
    }
  }, [attributes, chartSettings, chartUuid, chartWidth, dispatch, hasLegend, host, initialAfter, initialBefore, isPanAndZoomMaster, isRemotelyControlled, panAndZoom, portalNode, setShouldFetch, shouldEliminateZeroDimensions, shouldUsePanAndZoomPadding, shouldFetch, chartMetadata])

  const [selectedDimensions, setSelectedDimensions] = useState<string[]>([])

  const hasEmptyData = (chartData as DygraphData | D3pieChartData | null)?.result.data?.length === 0
    || (chartData as EasyPieChartData | null)?.result.length === 0

  if (!chartData || !chartMetadata) {
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
        <Loader
          key={`${hasEmptyData}`}
          hasEmptyData={hasEmptyData}
          containerNode={portalNode}
        />
      )}
      <Chart
        attributes={attributes}
        chartContainerElement={portalNode}
        chartData={chartData}
        chartMetadata={chartMetadata}
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
    </>
  )
}
