import React, { useMemo } from "react"
import { Flex, Icon, TextSmall } from "@netdata/netdata-ui"
import { formatDates, getTimePeriod } from "./utils"
import useConvertedDates from "./useConvertedDate"

const PeriodIndication = ({ startDate, endDate }) => {
  const [convertedStart, convertedEnd] = useConvertedDates(startDate, endDate)

  const { formattedStartDate, formattedEndDate } = useMemo(
    () => formatDates(convertedStart, convertedEnd),
    [convertedStart, convertedEnd]
  )
  const timePeriod = useMemo(
    () => getTimePeriod(convertedStart, convertedEnd),
    [convertedStart, convertedEnd]
  )

  return (
    <Flex alignItems="center" justifyContent="between" gap={2}>
      <Flex alignItems="center" justifyContent="center" gap={1.5}>
        <TextSmall strong whiteSpace="nowrap">
          From
        </TextSmall>
        <TextSmall whiteSpace="nowrap" data-testid="periodIndication-from">
          {formattedStartDate}
        </TextSmall>
      </Flex>
      <Icon name="arrow_left" size="small" color="textLite" rotate={2} />
      <Flex alignItems="center" justifyContent="center" gap={1.5}>
        <TextSmall strong whiteSpace="nowrap">
          To
        </TextSmall>
        <TextSmall whiteSpace="nowrap" data-testid="periodIndication-to">
          {formattedEndDate}
        </TextSmall>
      </Flex>
      <Flex alignItems="center" justifyContent="center" gap={2}>
        <TextSmall whiteSpace="nowrap">/</TextSmall>
        <TextSmall color="textLite" whiteSpace="nowrap" data-testid="periodIndication-period">
          {timePeriod}
        </TextSmall>
      </Flex>
    </Flex>
  )
}

export default PeriodIndication
