import React, { useCallback } from "react"
import { Flex } from "@netdata/netdata-ui"
import TimePeriod from "./timePeriod"
import { timePeriods } from "./utils"

const TimePeriods = ({ handleDatesChange, selectedDate, tagging }) => {
  const setTimeRange = useCallback(
    time =>
      handleDatesChange({
        startDate: time,
        endDate: 0,
      }),
    []
  )

  return (
    <Flex
      column
      justifyContent="start"
      alignItems="start"
      height={{ max: "240px" }}
      overflow={{ vertical: "scroll" }}
      data-testid="timePeriods"
    >
      {timePeriods.map(({ period, value }) => (
        <TimePeriod
          key={value}
          value={value}
          period={period}
          setTimeRange={setTimeRange}
          isSelected={selectedDate === value}
          tagging={tagging}
        />
      ))}
    </Flex>
  )
}

export default TimePeriods
