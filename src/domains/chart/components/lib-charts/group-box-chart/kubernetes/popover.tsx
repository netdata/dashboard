/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
// @ts-nocheck
import React from "react"
import { H5, Flex, DropContainer } from "@netdata/netdata-ui"

export const Header = (props) => <H5 color={["white", "pure"]} wordBreak="break-all" {...props} />

export const Separator = () => (
  <Flex height="1px" width="100%" background={["gray", "shuttleGray"]} />
)

const Popover = (props) => (
  <DropContainer
    background={["transparent", "popover"]}
    padding={[2, 4]}
    width="322px"
    height="422px"
    {...props}
  />
)

export default Popover
