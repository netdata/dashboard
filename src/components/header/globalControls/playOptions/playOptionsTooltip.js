import React from "react"
import { Flex, TextSmall } from "@netdata/netdata-ui"

const PlayOptionsTooltip = () => (
  <Flex
    padding={[1, 2]}
    margin={[1]}
    background={["neutral", "black"]}
    round={1}
    justifyContent="center"
    width={{ max: "320px" }}
  >
    <TextSmall color="bright">
      Play to refresh and have live content, pause to see historical, or force play to keep
      refreshing even when the tab loses focus at the expense of some system performance.
    </TextSmall>
  </Flex>
)

export default PlayOptionsTooltip
