import React from "react"
import { Flex, TextSmall } from "@netdata/netdata-ui"

const DurationBox = ({ isPlaying, duration }) => {
  return (
    <Flex gap={1}>
      <Flex width="24px" justifyContent="center">
        {isPlaying && (
          <TextSmall color="text" whiteSpace="nowrap">
            • last
          </TextSmall>
        )}
      </Flex>
      <TextSmall color="text" whiteSpace="nowrap">
        {duration}
      </TextSmall>
    </Flex>
  )
}

export default DurationBox
