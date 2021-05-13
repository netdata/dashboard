/* eslint-disable indent */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
// @ts-nocheck
import React from "react"
import { Flex, Button, getColor } from "@netdata/netdata-ui"
import styled from "styled-components"

export const TabButton = styled(Button).attrs(({ active }) => ({
  flavour: "borderless",
  neutral: true,
  themeType: "dark",
  className: "btn",
  disabled: active,
  "data-testid": "k8sPopoverChart-tab",
}))`
  &&& {
    height: initial;
    width: initial;
    padding: 2px 20px;
    ${({ active, theme }) => active && `border-bottom: 3px solid ${getColor("bright")({ theme })};`}
    color: ${({ active, theme }) => getColor(active ? "bright" : "separator")({ theme })}
  }
`

const Tabs = ({ value, onChange, ...rest }) => (
  <Flex data-testid="k8sPopoverChart-tabs" {...rest}>
    <TabButton label="Context" active={value === "context"} onClick={() => onChange("context")} />
    <TabButton label="Metrics" active={value === "metrics"} onClick={() => onChange("metrics")} />
  </Flex>
)

export default Tabs
