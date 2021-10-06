import React, { useMemo, forwardRef } from "react"
import Tooltip from "@/src/components/tooltips"
import { getStartDate, getEndDate, getIsSameDate, getDuration, getGranularDuration } from "./utils"
import Container from "./container"
import DateBox from "./dateBox"
import DurationBox from "./durationBox"

const PickerAccessorElement = forwardRef(
  ({ onClick, start, end, isPlaying, isPickerOpen, tagging }, ref) => {
    const [startDate, endDate, isSameDate] = useMemo(() => {
      const startDate = getStartDate(start)
      const endDate = getEndDate(end)
      const isSameDate = getIsSameDate(startDate, endDate)
      return [startDate, endDate, isSameDate]
    }, [start, end])

    const duration = useMemo(
      () => getGranularDuration(getDuration(startDate, endDate).as("milliseconds")),
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
