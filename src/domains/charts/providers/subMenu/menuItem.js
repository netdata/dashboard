import React from "react"
import styled, { css } from "styled-components"
import { TextSmall, getColor } from "@netdata/netdata-ui"
import { withActiveMenu } from "domains/charts/providers/active"
import { withSubMenu } from "./context"

const styledActive = css`
  border-left: 1px solid ${getColor("key")};
  color: ${getColor("key")};
`

const MenuItem = styled(TextSmall).attrs(({ active, title, link, href, children }) => ({
  as: "a",
  strong: active,
  padding: [0.5, 7],
  role: "listitem",
  children: title || children,
  href: link || href,
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
export const withSubMenuActive = Component => ({ activeSubMenuId, chartSubMenuId, ...rest }) => (
  <Component
    active={chartSubMenuId === activeSubMenuId}
    activeSubMenuId={activeSubMenuId}
    chartSubMenuId={chartSubMenuId}
    {...rest}
  />
)

export const MenuItemContainer = withActiveMenu(withSubMenu(withSubMenuActive(MenuItem)))
