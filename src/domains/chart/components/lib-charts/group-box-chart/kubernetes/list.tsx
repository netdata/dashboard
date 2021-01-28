/* eslint-disable object-curly-newline */
/* eslint-disable react/prop-types */
// @ts-nocheck
import React from "react"
import { Flex, Button, makeFlex } from "@netdata/netdata-ui"
import styled from "styled-components"
import Separator from "./separator"
import Header from "./header"
import Item from "./item"
import getLabel from "./getLabel"

const StyledButton = styled(makeFlex(Button)).attrs({
  flavour: "borderless",
  neutral: true,
  themeType: "dark",
  className: "btn",
  alignItems: "start",
  gap: 1,
})`
  &&& {
    padding: 0;
    margin: 0;
    height: initial;
    width: initial;

    svg {
      height: 18px;
      width: 18px;
      position: initial;
    }
  }
`

const List = ({ labelId, items, onBack }) => {
  const { title, icon } = getLabel(labelId)

  return (
    <Flex height="100%" gap={3} column>
      <Header>
        <StyledButton label={`${title} (${items.length})`} icon="chevron_left" onClick={onBack} />
      </Header>
      <Separator />
      <Flex gap={3} overflow={{ vertical: "auto", horizontal: "hidden" }} column>
        {items.map((item) => (
          <Item key={item} icon={icon} title={item} />
        ))}
      </Flex>
    </Flex>
  )
}

export default List
