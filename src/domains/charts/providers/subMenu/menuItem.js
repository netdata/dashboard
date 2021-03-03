import React, { useMemo } from "react"
import styled, { css } from "styled-components"
import { TextSmall, getColor } from "@netdata/netdata-ui"
import { useActiveSubMenuId } from "domains/charts/providers/active"
import { withSubMenu } from "./context"

const styledActive = css`
  border-left: 1px solid ${getColor("key")};
  color: ${getColor("key")};
`

const MenuItem = styled(TextSmall).attrs(({ active, title, link, children }) => ({
  as: "a",
  strong: active,
  padding: [0.5, 7],
  role: "listitem",
  children: title || children,
  href: `#${link}`,
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

const withMenuItemClick = Component => ({ id, onSubMenuClick, ...rest }) => {
  const subMenuClick = useMemo(() => onSubMenuClick && (e => onSubMenuClick(id, e)), [
    onSubMenuClick,
    id,
  ])
  return <Component onClick={subMenuClick} id={id} {...rest} />
}

export const withSubMenuActive = Component => ({ id, ...rest }) => {
  const active = useActiveSubMenuId(state => id === state)
  return <Component active={active} id={id} {...rest} />
}

export const MenuItemContainer = withSubMenu(withSubMenuActive(withMenuItemClick(MenuItem)))
