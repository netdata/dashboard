import React from "react"
import { Icon, Flex } from "@netdata/netdata-ui"

const Item = ({ icon, children, hasBorder }) => (
  <Flex
    gap={2}
    border={hasBorder && { side: "right", color: "selected" }}
    alignItems="center"
    padding={[0, 3, 0, 0]}
  >
    {!!icon && <Icon name={icon} color="text" height="15px" />}
    {children}
  </Flex>
)

export default Item
