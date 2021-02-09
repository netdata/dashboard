/* eslint-disable react/prop-types */
// @ts-nocheck
import React from "react"
import { Text, Flex, Icon } from "@netdata/netdata-ui"

const Item = ({ icon, title, secondary }) => (
  <Flex gap={1} alignItems="start" data-testid="k8sPopoverItem">
    <Flex width="22px" height="22px" data-testid="k8sPopoverItem-icon">
      <Icon
        name={icon}
        color={["white", "pure"]}
        margin={[0, 1, 0, 0]}
        width="22px"
        height="22px"
      />
    </Flex>
    <Text color={["white", "pure"]} data-testid="k8sPopoverItem-title">
      {title}
    </Text>
    {secondary && (
      <Text color="border" wordBreak="break-all" data-testid="k8sPopoverItem-detail">
        {secondary}
      </Text>
    )}
  </Flex>
)

export default Item
