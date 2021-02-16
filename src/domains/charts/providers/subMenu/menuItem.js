import React from "react"
import styled, { css } from "styled-components"
import { TextSmall, getColor } from "@netdata/netdata-ui"
import { ActiveMenuConsumer } from "domains/charts/providers/active"
import { SubMenuConsumer } from "./context"

const styledActive = css`
  border-left: 1px solid ${getColor("key")};
  color: ${getColor("key")};
`

const MenuItem = styled(TextSmall).attrs(({ active }) => ({
  as: "a",
  strong: active,
  padding: [0.5, 7],
  role: "listitem",
}))`
  &&& {
    text-decoration: none;
    border-left: 1px solid transparent;
    color: ${getColor("border")};
    ${props => props.active && styledActive}
    &:hover {
      ${styledActive}
    }
  }
`
export const MenuItemContainer = ({ id, ...rest }) => (
  <ActiveMenuConsumer>
    {({ subMenuId }) => (
      <SubMenuConsumer id={id}>
        {({ link, chartSubMenuId, title }) => (
          <MenuItem href={link} active={subMenuId === chartSubMenuId} {...rest}>
            {title}
          </MenuItem>
        )}
      </SubMenuConsumer>
    )}
  </ActiveMenuConsumer>
)
