import React, { memo, useCallback } from "react"
import { Text } from "@netdata/netdata-ui"
import { StyledTimePeriod } from "./styled"

const TimePeriod = ({ value, period, resolution, isSelected, setTimeRange, tagging }) => {
  const onClick = useCallback(
    () => setTimeRange(value, resolution),
    [value, resolution, setTimeRange]
  )
  return (
    <StyledTimePeriod
      key={value}
      onClick={onClick}
      data-ga={`date-picker::click-quick-selector::${tagging}::${-value}`}
      data-testid="timePeriod-value"
    >
      <Text color={isSelected ? "primary" : "text"}>{period}</Text>
    </StyledTimePeriod>
  )
}

export default memo(TimePeriod)
