import React from "react"
import styled from "styled-components"
import { Flex } from "@netdata/netdata-ui"
import Node from "./node"
import Options from "./options"
import ProtoBuf from "./protoBuf"
import Version from "./version"
import GlobalControls from "./globalControls"
import Alarms from "./alarms"
import News from "./news"
import Timezone from "./timezone"
import SignIn from "./signIn"
import { CloudConnectionStatus } from "./ACLK"
const Wrapper = styled(Flex).attrs({
  as: "header",
  position: "relative",
  justifyContent: "between",
  background: "panel",
  zIndex: 20,
  width: "100%",
  padding: [2, 4, 2, 4],
})`
  pointer-events: all;
`

const Header = () => (
  <Wrapper>
    <Flex alignItems="center" gap={3}>
      <Node />
    </Flex>
    <Flex justifyContent="end" alignItems="center" gap={3}>
      <CloudConnectionStatus />
      <Version />
      <News />
      <Options />
      <ProtoBuf />
      <Timezone />
      <GlobalControls />
      <Alarms />
      <SignIn />
    </Flex>
  </Wrapper>
)

export default Header
