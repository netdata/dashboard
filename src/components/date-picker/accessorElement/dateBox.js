import React from "react"
import { Flex, TextSmall, Icon } from "@netdata/netdata-ui"

const DateBox = ({ isPlaying, startDate, endDate, isSameDate }) => {
  return (
    <Flex gap={2}>
      <TextSmall color="text" whiteSpace="nowrap">
        {startDate.format("DD/MM/YYYY")} •{" "}
        <TextSmall color={isPlaying ? "accent" : "textFocus"} whiteSpace="nowrap">
          {startDate.format("HH:mm")}
        </TextSmall>
      </TextSmall>
      <Icon name="arrow_left" color={isPlaying ? "accent" : "textFocus"} size="small" rotate={2} />
      <TextSmall color="text" whiteSpace="nowrap">
        {!isSameDate && `${endDate.format("DD/MM/YYYY")} • `}
        <TextSmall color={isPlaying ? "accent" : "textFocus"} whiteSpace="nowrap">
          {endDate.format("HH:mm")}
        </TextSmall>
      </TextSmall>
    </Flex>
  )
}

export default DateBox