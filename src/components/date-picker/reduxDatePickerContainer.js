import React, { memo, useEffect, useMemo } from "react"
import {
  useDispatch as useDashboardDispatch,
  useSelector as useDashboardSelector,
} from "store/redux-separate-context"
import {
  resetGlobalPanAndZoomAction,
  setGlobalPanAndZoomAction,
  setDefaultAfterAction,
} from "domains/global/actions"
import { selectDefaultAfter, selectGlobalPanAndZoom } from "domains/global/selectors"
import { setHashParams } from "utils/hash-utils"
import DatePickerDrop from "./datePickerDrop"

const ReduxDatePickerContainer = memo(({ tagging, isPlaying }) => {
  const dashboardDispatch = useDashboardDispatch()

  const globalPanAndZoom = useDashboardSelector(selectGlobalPanAndZoom)
  const isGlobalPanAndZoom = Boolean(globalPanAndZoom)

  const defaultAfter = useDashboardSelector(selectDefaultAfter)
  const pickedValues = useMemo(
    () =>
      isGlobalPanAndZoom
        ? { start: globalPanAndZoom.after, end: globalPanAndZoom.before }
        : {
            start: defaultAfter,
            end: 0,
          },
    [isGlobalPanAndZoom, globalPanAndZoom, defaultAfter]
  )

  function handlePickedValuesChange(params) {
    const { start, end } = params
    if (start < 0) {
      // live mode
      dashboardDispatch(
        // changes the default value, so it becomes inconsistent
        setDefaultAfterAction({
          after: start,
        })
      )
      if (isGlobalPanAndZoom) {
        dashboardDispatch(resetGlobalPanAndZoomAction())
      }
    } else {
      // global-pan-and-zoom mode
      dashboardDispatch(
        setGlobalPanAndZoomAction({
          after: start,
          before: end,
        })
      )
    }
  }

  useEffect(() => {
    const { start, end } = pickedValues
    const after = start.toString()
    const before = end.toString()
    if (window.urlOptions.after !== after || window.urlOptions.before !== before) {
      window.urlOptions.netdataPanAndZoomCallback(true, after, before)
    }
    setHashParams({ after, before })
  }, [pickedValues])
  return (
    <DatePickerDrop
      values={pickedValues}
      defaultValue={defaultAfter}
      onChange={handlePickedValuesChange}
      tagging={tagging}
      isPlaying={isPlaying}
    />
  )
})

export default ReduxDatePickerContainer
