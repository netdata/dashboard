import React from "react"
import styled from "styled-components"
import { Flex, H4, Collapsible } from "@netdata/netdata-ui"

export const DefaultListHeader = styled(H4).attrs({ padding: [0], margin: [0] })`
  cursor: pointer;
`

const SectionHandle = ({ toggleOpen, label, testid, Header = DefaultListHeader }) => (
  <Header data-testid={testid} onClick={toggleOpen}>
    {label}
  </Header>
)

const ItemsList = ({ isOpen = false, toggleOpen, label, children, testid, Header }) => (
  <Flex column>
    <SectionHandle Header={Header} toggleOpen={toggleOpen} label={label} testid={testid} />
    <Collapsible open={isOpen}>{children}</Collapsible>
  </Flex>
)

export default ItemsList
