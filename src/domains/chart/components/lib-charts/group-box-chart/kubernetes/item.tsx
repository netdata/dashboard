/* eslint-disable object-curly-newline */
/* eslint-disable react/prop-types */
// @ts-nocheck
import React from "react"
import styled from "styled-components"
import { Text, Flex, Icon } from "@netdata/netdata-ui"

const ExternalButton = styled(Icon).attrs({
  margin: [0, 0, 0, "auto"],
  color: "bright",
  width: "10px",
  height: "10px",
  alignSelf: "center",
  name: "nav_arrow_goto",
  role: "button",
  title: "Go to node",
  "data-testid": "k8sPopoverItem-externalButton",
})`
  cursor: pointer;
`

const Item = ({ icon, title, secondary, onClick }) => (
  <Flex gap={1} alignItems="start" data-testid="k8sPopoverItem">
    <Flex width="22px" height="22px" data-testid="k8sPopoverItem-icon">
      <Icon name={icon} color="bright" margin={[0, 1, 0, 0]} width="22px" height="22px" />
    </Flex>
    <Text color="bright" data-testid="k8sPopoverItem-title">
      {title}
    </Text>
    {secondary && (
      <Text color="border" wordBreak="break-all" data-testid="k8sPopoverItem-detail">
        {secondary}
      </Text>
    )}
    {onClick && <ExternalButton onClick={onClick} />}
  </Flex>
)

export default Item
