import React from "react"
import styled from "styled-components"
import { Text } from "@netdata/netdata-ui"
import Item from "../item"
import NetdataLogo from "components/sidebar/netdataLogo"

const Netdata = styled(Text)`
  letter-spacing: 4px;
`

const Logo = () => (
  <Item hasBorder>
    <NetdataLogo width={24} height={24} />
    <Netdata>NETDATA</Netdata>
    <Text>Agent</Text>
  </Item>
)

export default Logo
