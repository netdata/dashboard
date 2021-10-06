import React, { useState, useMemo, useEffect, forwardRef } from "react"
import Tooltip from "@/src/components/tooltips"
import { useSelector as useDashboardSelector } from "store/redux-separate-context"
import { selectGlobalPanAndZoom } from "domains/global/selectors"
import {
  getStartDate,
  getEndDate,
  getIsSameDate,
  getDuration,
  MINUTE,
  getGranularDuration,
} from "./utils"
import Container from "./container"
import DateBox from "./dateBox"
import DurationBox from "./durationBox"

const PickerAccessorElement = forwardRef(
  (
    { onClick, start = 15 * MINUTE, end, isPlaying, isPickerOpen, setRangeValues, tagging },
    ref
  ) => {
    const [timeframe, setTimeframe] = useState()
    const startDate = getStartDate(start)
    const endDate = getEndDate(end)
    const globalPanAndZoom = useDashboardSelector(selectGlobalPanAndZoom)
    useEffect(() => {
      const after = getDuration(startDate, endDate).as("seconds")
      if (!isPlaying && timeframe !== after) setTimeframe(Math.round(after))
      if (isPlaying && timeframe && !!globalPanAndZoom) {
        setRangeValues({ start: Math.round(timeframe) })
        setTimeframe(null)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDate, endDate, timeframe, isPlaying])

    const isSameDate = useMemo(() => getIsSameDate(startDate, endDate), [startDate, endDate])
    const duration = useMemo(
      () => getGranularDuration(getDuration(startDate, endDate).as("milliseconds")),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [isPlaying, startDate, endDate]
    )

    return (
      <Tooltip
        content={isPickerOpen ? () => {} : "Select a predefined or a custom timeframe"}
        align="bottom"
        plain
      >
        <Container
          alignItems="center"
          justifyContent="center"
          gap={1}
          height="100%"
          width={{ min: "380px" }}
          onMouseDown={onClick}
          padding={[0, 1]}
          ref={ref}
          data-ga={`date-picker::click-time::${tagging}`}
          data-testid="datePicker-accessorElement"
        >
          <DateBox
            isPlaying={isPlaying}
            endDate={endDate}
            startDate={startDate}
            isSameDate={isSameDate}
          />
          <DurationBox isPlaying={isPlaying} duration={duration} />
        </Container>
      </Tooltip>
    )
  }
)

export default PickerAccessorElement
