import React, { memo, useCallback } from "react"
import { Text } from "@netdata/netdata-ui"
import { StyledTimePeriod } from "./styled"

const TimePeriod = ({ value, period, isSelected, setTimeRange, tagging }) => {
  const onClick = useCallback(() => setTimeRange(value), [value])
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
