import React from "react"
import styled from "styled-components"
import { Flex } from "@netdata/netdata-ui"
import { MenuGroupContainer } from "domains/charts/providers/menuGroup"
import { ActiveMenuConsumer } from "domains/charts/providers/active"
import { MenuConsumer } from "./context"

export const Menu = ({ ids, activeMenuId, onMenuGroupClick, onSubMenuClick, ...rest }) => (
  <Flex as="ul" role="complementary" column {...rest}>
    {ids.map(id => {
      const active = activeMenuId === id
      return (
        <MenuGroupContainer
          key={id}
          id={id}
          active={active}
          onMenuGroupClick={onMenuGroupClick && (e => onMenuGroupClick(id, e))}
          onSubMenuClick={onSubMenuClick && ((subMenuId, e) => onSubMenuClick(id, subMenuId, e))}
        />
      )
    })}
  </Flex>
)

export const MenuSidebar = styled(Flex).attrs({
  overflow: { vertical: "auto" },
})`
  position: sticky;
  top: 0;
  // todo calc(100vh - $0.getBoundingClientRect().top)
  max-height: calc(100vh - 128px);
`

export const MenuSidebarContainer = ({
  ids,
  activeMenuId,
  onMenuGroupClick,
  onSubMenuClick,
  ...rest
}) => (
  <MenuSidebar {...rest}>
    <Menu
      ids={ids}
      activeMenuId={activeMenuId}
      onMenuGroupClick={onMenuGroupClick}
      onSubMenuClick={onSubMenuClick}
    />
  </MenuSidebar>
)

export const SidebarContainer = props => (
  <ActiveMenuConsumer>
    {({ menuId }) => (
      <MenuConsumer>
        {ids => <MenuSidebarContainer ids={ids} activeMenuId={menuId} {...props} />}
      </MenuConsumer>
    )}
  </ActiveMenuConsumer>
)
