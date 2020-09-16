import React, { useEffect } from "react"

import { MS_IN_SECOND } from "utils"
import { serverDefault } from "utils/server-detection"
import { selectIsSnapshotMode, selectSnapshotOptions } from "domains/dashboard/selectors"
import { selectGlobalPanAndZoom } from "domains/global/selectors"
import { useDispatch, useSelector } from "store/redux-separate-context"
import { TimeRangeObjT } from "types/common"

import { Attributes } from "../utils/transformDataAttributes"
import { fetchDataForSnapshotAction } from "../actions"
import { chartLibrariesSettings } from "../utils/chartLibrariesSettings"
import { getChartURLOptions } from "../utils/get-chart-url-options"

interface SnapshotLoaderProps {
  attributes: Attributes
  chartUuid: string
}
const SnapshotLoader = ({
  attributes,
  chartUuid,
}: SnapshotLoaderProps) => {
  const host = attributes.host || serverDefault
  const { snapshotDataPoints } = useSelector(selectSnapshotOptions)
  const group = attributes.method || window.NETDATA.chartDefaults.method
  const { chartLibrary } = attributes
  const chartSettings = chartLibrariesSettings[chartLibrary]

  const globalPanAndZoom = useSelector(selectGlobalPanAndZoom)
  const after = (globalPanAndZoom as TimeRangeObjT).after / MS_IN_SECOND
  const before = (globalPanAndZoom as TimeRangeObjT).before / MS_IN_SECOND

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchDataForSnapshotAction.request({
      // properties to be passed to API
      host,
      chart: attributes.id,
      format: chartSettings.format,
      points: snapshotDataPoints as number,
      group,
      gtime: attributes.gtime || 0,
      // for snapshots, always eliminate zero dimensions
      options: getChartURLOptions(attributes, true),
      after: after || null,
      before: before || null,
      dimensions: attributes.dimensions,
      aggr_method: attributes.aggrMethod,
      chartLibrary,
      id: chartUuid,
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // todo fetch based on state
  return null
}


interface SnapshotLoaderContainerProps {
  attributes: Attributes
  chartUuid: string
}
export const SnapshotLoaderContainer = ({
  attributes,
  chartUuid,
}: SnapshotLoaderContainerProps) => {
  const isSnapshotMode = useSelector(selectIsSnapshotMode)
  if (!isSnapshotMode) {
    return null
  }
  return <SnapshotLoader attributes={attributes} chartUuid={chartUuid} />
}
