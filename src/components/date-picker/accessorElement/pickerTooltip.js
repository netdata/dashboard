import React from "react"
import { Flex, TextSmall } from "@netdata/netdata-ui"

const PickerTooltip = ({ children }) => (
  <Flex
    padding={[1, 2]}
    margin={[1]}
    background={["neutral", "black"]}
    round={1}
    justifyContent="center"
  >
    <TextSmall color="bright">{children}</TextSmall>
  </Flex>
)

export default PickerTooltip
