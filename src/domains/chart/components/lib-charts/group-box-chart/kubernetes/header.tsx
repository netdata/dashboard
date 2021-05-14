/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
// @ts-nocheck
import React from "react"
import { H5 } from "@netdata/netdata-ui"

const Header = props => (
  <H5 color="bright" wordBreak="break-all" data-testid="k8sPopover-header" {...props} />
)

export default Header
