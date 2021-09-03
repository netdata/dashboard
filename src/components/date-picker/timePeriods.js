import React from "react"
import { Flex } from "@netdata/netdata-ui"
import TimePeriod from "./timePeriod"
import { timePeriods } from "./utils"

const TimePeriods = ({ handleTimePeriodChange, selectedDate, tagging }) => (
  <Flex
    column
    justifyContent="start"
    alignItems="start"
    height={{ max: "240px" }}
    overflow={{ vertical: "scroll" }}
    data-testid="timePeriods"
  >
    {timePeriods.map(({ period, value, resolution }) => (
      <TimePeriod
        key={value}
        value={value}
        period={period}
        resolution={resolution}
        setTimeRange={handleTimePeriodChange}
        isSelected={selectedDate === value}
        tagging={tagging}
      />
    ))}
  </Flex>
)

export default TimePeriods
