import React from "react"
import { Flex, TextSmall, Icon } from "@netdata/netdata-ui"
import { useDateTime } from "utils/date-time"

const DateBox = ({ isPlaying, startDate, endDate, isSameDate }) => {
  const { localeTimeString, localeDateString } = useDateTime()
  return (
    <Flex gap={2}>
      <TextSmall color="text" whiteSpace="nowrap">
        {localeDateString(startDate, { long: false })} •{" "}
        <TextSmall color={isPlaying ? "accent" : "textFocus"} whiteSpace="nowrap">
          {localeTimeString(startDate, { secs: false })}
        </TextSmall>
      </TextSmall>
      <Icon name="arrow_left" color={isPlaying ? "accent" : "textFocus"} size="small" rotate={2} />
      <TextSmall color="text" whiteSpace="nowrap">
        {!isSameDate && `${localeDateString(endDate, { long: false })} • `}
        <TextSmall color={isPlaying ? "accent" : "textFocus"} whiteSpace="nowrap">
          {localeTimeString(endDate, { secs: false })}
        </TextSmall>
      </TextSmall>
    </Flex>
  )
}

export default DateBox
