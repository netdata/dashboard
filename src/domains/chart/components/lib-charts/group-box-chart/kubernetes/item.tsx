/* eslint-disable react/prop-types */
// @ts-nocheck
import React from "react"
import { Text, Flex, Icon } from "@netdata/netdata-ui"

const Item = ({ icon, title, secondary }) => (
  <Flex gap={1} alignItems="start">
    <Flex width="22px" height="22px">
      <Icon
        name={icon}
        color={["white", "pure"]}
        margin={[0, 1, 0, 0]}
        width="22px"
        height="22px"
      />
    </Flex>
    <Text color={["white", "pure"]}>{title}</Text>
    {secondary && (
      <Text color="border" wordBreak="break-all">
        {secondary}
      </Text>
    )}
  </Flex>
)

export default Item
