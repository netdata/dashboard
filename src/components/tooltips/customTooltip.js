import React from "react"
import { Flex, TextSmall } from "@netdata/netdata-ui"

const tooltipBackground = ["neutral", "black"]

const CustomTooltip = ({ children, isBasic }) => (
  <Flex
    padding={[1.5, 2]}
    margin={[2]}
    background={tooltipBackground}
    round={1}
    {...(!isBasic && { width: { max: "300px" } })}
  >
    <TextSmall color="bright">{children}</TextSmall>
  </Flex>
)

export default CustomTooltip
