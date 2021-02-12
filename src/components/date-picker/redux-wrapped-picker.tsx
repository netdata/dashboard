import React, { useState, useEffect } from "react"

import { useDispatch, useSelector } from "store/redux-separate-context"
import { selectGlobalPanAndZoom, selectDefaultAfter } from "domains/global/selectors"
import {
  resetGlobalPanAndZoomAction,
  setDefaultAfterAction,
  setGlobalPanAndZoomAction,
} from "domains/global/actions"

import { Picker } from "./picker"
import { PickedValues } from "./types"

interface Props {
  tagging?: string
}
export const ReduxWrappedPicker = ({ tagging }: Props) => {
  const dispatch = useDispatch()

  const [isOpen, setOpenState] = useState<boolean>(false)

  const globalPanAndZoom = useSelector(selectGlobalPanAndZoom)
  const isGlobalPanAndZoom = Boolean(globalPanAndZoom)

  const defaultAfter = useSelector(selectDefaultAfter)
  const pickedValues = {
    start: isGlobalPanAndZoom ? globalPanAndZoom!.after : defaultAfter,
    end: isGlobalPanAndZoom ? globalPanAndZoom!.before : 0,
  }
  function controlOpenState(state: boolean) {
    setOpenState(state)
  }

  function handlePickedValuesChange(params: PickedValues) {
    const { start, end } = params
    if (start < 0) {
      // live mode
      dispatch(
        setDefaultAfterAction({
          after: start,
        }),
      )
      if (isGlobalPanAndZoom) {
        dispatch(resetGlobalPanAndZoomAction())
      }
    } else {
      // global-pan-and-zoom mode
      dispatch(
        setGlobalPanAndZoomAction({
          after: start,
          before: end,
        }),
      )
    }
  }

  useEffect(() => {
    const { start, end } = pickedValues
    if (window.urlOptions) {
      if (window.urlOptions.after !== start || window.urlOptions.before !== end) {
        const isPanAndZoom = start > 0
        window.urlOptions.netdataPanAndZoomCallback(isPanAndZoom, start, end)
      }
    }
  }, [pickedValues])

  return (
    <Picker
      isOpen={isOpen}
      pickedValues={pickedValues}
      handleOpenState={controlOpenState}
      setRangeValues={handlePickedValuesChange}
      tagging={tagging}
    />
  )
}
