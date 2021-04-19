import React from "react"
import { Icon, Flex } from "@netdata/netdata-ui"

const Item = ({ icon, children, hasBorder }) => (
  <Flex
    gap={2}
    border={hasBorder && { side: "right", color: "separator" }}
    alignItems="center"
    padding={[0, 3, 0, 0]}
    height="100%"
  >
    {!!icon && <Icon name={icon} color="bright" height="15px" />}
    {children}
  </Flex>
)

export default Item
