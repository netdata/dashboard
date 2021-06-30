import React from "react"
import { Flex, TextSmall, Icon } from "@netdata/netdata-ui"
import { useDateTime } from "utils/date-time"

const DateBox = ({ isPlaying, startDate, endDate, isSameDate }) => {
  const { localeTimeString, localeDateString } = useDateTime()
  return (
    <Flex gap={2}>
      <TextSmall color="text" whiteSpace="nowrap">
        {localeDateString(startDate, false)} •{" "}
        <TextSmall color={isPlaying ? "accent" : "textFocus"} whiteSpace="nowrap">
          {localeTimeString(startDate, false)}
        </TextSmall>
      </TextSmall>
      <Icon name="arrow_left" color={isPlaying ? "accent" : "textFocus"} size="small" rotate={2} />
      <TextSmall color="text" whiteSpace="nowrap">
        {!isSameDate && `${localeDateString(endDate, false)} • `}
        <TextSmall color={isPlaying ? "accent" : "textFocus"} whiteSpace="nowrap">
          {localeTimeString(endDate, false)}
        </TextSmall>
      </TextSmall>
    </Flex>
  )
}

export default DateBox
