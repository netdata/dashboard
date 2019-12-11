import {
  propOr, cond, always, T,
} from "ramda"
import React, { useEffect, useState } from "react"
import { useThrottle } from "react-use"

import { AppStateT } from "store/app-state"
import { useSelector, useDispatch } from "store/redux-separate-context"

import { selectGlobalPanAndZoom, selectGlobalSelection } from "domains/global/selectors"
import { fallbackUpdateTimeInterval, panAndZoomDelay } from "domains/chart/constants"
import { serverDefault } from "utils/server-detection"
import { useFetchNewDataClock } from "../hooks/use-fetch-new-data-clock"

import { chartLibrariesSettings } from "../utils/chartLibrariesSettings"
import { Attributes } from "../utils/transformDataAttributes"
import { getChartPixelsPerPoint } from "../utils/get-chart-pixels-per-point"

import { fetchChartAction, fetchDataAction } from "../actions"
import {
  selectChartData, selectChartFetchDataParams, selectChartDetailsRequest,
} from "../selectors"
import { ChartData, ChartDetails } from "../chart-types"

import { Chart } from "./chart"
import "./chart-with-loader.css"

const getChartURLOptions = (attributes: Attributes) => {
  const {
    appendOptions,
    overrideOptions,
  } = attributes
  let ret = ""

  ret += overrideOptions
    ? overrideOptions.toString()
    : chartLibrariesSettings[attributes.chartLibrary].options(attributes)

  if (typeof appendOptions === "string") {
    ret += `|${encodeURIComponent(appendOptions)}`
  }

  ret += "|jsonwrap"

  // todo
  const isForUniqueId = false
  // always add `nonzero` when it's used to create a chartDataUniqueID
  // we cannot just remove `nonzero` because of backwards compatibility with old snapshots
  if (isForUniqueId || window.NETDATA.options.current.eliminate_zero_dimensions) {
    ret += "|nonzero"
  }

  return ret
}


export type Props = {
  attributes: Attributes
  chartUuid: string
  portalNode: HTMLElement
}

export const ChartWithLoader = ({
  attributes,
  chartUuid,
  portalNode,
}: Props) => {
  /**
   * fetch chart details
   */
  const host = attributes.host || serverDefault
  const dispatch = useDispatch()
  const { chartDetails, isFetchingDetails } = useSelector((state: AppStateT) => (
    selectChartDetailsRequest(state, { id: chartUuid })
  ))
  useEffect(() => {
    if (!chartDetails && !isFetchingDetails) {
      dispatch(fetchChartAction.request({
        chart: attributes.id,
        id: chartUuid,
        host,
      }))
    }
  }, [attributes.id, chartDetails, chartUuid, dispatch, host, isFetchingDetails])


  // todo local state option
  const globalPanAndZoom = useSelector(selectGlobalPanAndZoom)
  const isGlobalPanAndZoomMaster = !!globalPanAndZoom && globalPanAndZoom.masterID === chartUuid
  const shouldForceTimeRange: boolean = propOr(false, "shouldForceTimeRange", globalPanAndZoom)

  // (isRemotelyControlled === false) only during globalPanAndZoom, when chart is panAndZoomMaster
  // and when no toolbox is used at that time
  const isRemotelyControlled = !globalPanAndZoom
    || !isGlobalPanAndZoomMaster
    || shouldForceTimeRange // used when zooming/shifting in toolbox


  const fetchDataParams = useSelector((state: AppStateT) => selectChartFetchDataParams(
    state, { id: chartUuid },
  ))
  const chartData = useSelector((state: AppStateT) => selectChartData(state, { id: chartUuid }))

  const hoveredX = useSelector(selectGlobalSelection)

  // periodical update of newest data
  // default to 2000ms. When chartDetails has been fetched, use chartDetails.update_every
  // if chartData has been fetched, use chartData.view_update_every instead
  // todo add support to "data-update-every" attribute
  const viewUpdateEvery = cond([
    [always(!!chartData), () => (chartData as ChartData).view_update_every * 1000],
    [always(!!chartDetails), () => (chartDetails as ChartDetails).update_every * 1000],
    [T, always(fallbackUpdateTimeInterval)],
  ])()
  const [shouldFetch, setShouldFetch] = useFetchNewDataClock({
    areCriteriaMet: !globalPanAndZoom && !hoveredX,
    preferedIntervalTime: viewUpdateEvery,
  })

  const globalPanAndZoomThrottled = useThrottle(globalPanAndZoom, panAndZoomDelay)
  useEffect(() => {
    setShouldFetch(true)
  }, [globalPanAndZoomThrottled, setShouldFetch])

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

  /**
   * fetch data
   */
  useEffect(() => {
    if (shouldFetch && chartDetails) {
      // todo can be overriden by main.js
      const forceDataPoints = window.NETDATA.options.force_data_points

      let after
      let before
      let viewRange
      let pointsMultiplier = 1

      if (globalPanAndZoom) {
        if (isGlobalPanAndZoomMaster) {
          after = Math.round(globalPanAndZoom.after / 1000)
          before = Math.round(globalPanAndZoom.before / 1000)

          viewRange = [after, before]

          if (window.NETDATA.options.current.pan_and_zoom_data_padding) {
            const requestedPadding = Math.round((before - after) / 2)
            after -= requestedPadding
            before += requestedPadding
            pointsMultiplier = 2
          }
        } else {
          after = Math.round(globalPanAndZoom.after / 1000)
          before = Math.round(globalPanAndZoom.before / 1000)
          pointsMultiplier = 1
        }
      } else {
        // no globalPanAndZoom
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
        chart: chartDetails.id,
        format: chartSettings.format,
        points,
        group,
        gtime: attributes.gtime || 0,
        options: getChartURLOptions(attributes),
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
  }, [attributes, chartDetails, chartSettings, chartUuid, chartWidth, dispatch, globalPanAndZoom,
    hasLegend, host, initialAfter, initialBefore, isGlobalPanAndZoomMaster,
    isRemotelyControlled, portalNode, setShouldFetch, shouldFetch])

  const [selectedDimensions, setSelectedDimensions] = useState<string[]>([])

  if (!chartData || !chartDetails) {
    return <div className="chart-container__loader">loading...</div>
  }

  return (
    <Chart
      attributes={attributes}
      chartContainerElement={portalNode}
      chartData={chartData}
      chartDetails={chartDetails}
      chartUuid={chartUuid}
      chartHeight={chartHeight}
      chartWidth={chartWidth}
      isRemotelyControlled={fetchDataParams.isRemotelyControlled}
      selectedDimensions={selectedDimensions}
      setSelectedDimensions={setSelectedDimensions}
      showLatestOnBlur={!globalPanAndZoom}
    />
  )
}
