import React from "react"
import styled from "styled-components"
import { Flex } from "@netdata/netdata-ui"
import Item from "./item"
import Node from "./node"
import Options from "./options"
import Version from "./version"
import DateTimePicker from "./dateTimePicker"
import Alarms from "./alarms"
import AgentNews from "./news"
import SignIn from "./signIn"

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
      <Item hasBorder>
        <Version />
        <AgentNews />
        <Options />
      </Item>
      <DateTimePicker />
      <Alarms />
      <SignIn />
    </Flex>
  </Wrapper>
)

export default Header
