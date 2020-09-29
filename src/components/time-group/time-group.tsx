import React from "react"

import { useDispatch, useSelector } from "store/redux-separate-context"
import { selectDefaultAfter } from "domains/global/selectors"
import { resetGlobalPanAndZoomAction, setDefaultAfterAction } from "domains/global/actions"

import { TimeBtn } from "./timebtn"
import { ButtonGroup } from "./styled"
import { timeSlices } from "./constants"

export const TimeGroup = () => {
  const dispatch = useDispatch()
  const selectedGap = useSelector(selectDefaultAfter)
  const setSelected = (gap: string, timeOffset: number) => {
    dispatch(resetGlobalPanAndZoomAction())
    dispatch(setDefaultAfterAction({
      after: timeOffset,
    }))
  }
  return (
    <>
      <ButtonGroup>
        Last&nbsp;
        {timeSlices.map(({ text, timeGap }) => (
          <TimeBtn
            key={text}
            gap={timeGap}
            isSelected={selectedGap === timeGap}
            setTimeOffset={setSelected}
          >
            {text}
          </TimeBtn>
        ))}
      </ButtonGroup>
    </>
  )
}
