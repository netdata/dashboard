import React from "react"
import styled from "styled-components"
import { Flex } from "@netdata/netdata-ui"
import { MenuGroupContainer } from "domains/charts/providers/menuGroup"
import { withActiveMenu } from "domains/charts/providers/active"
import { withMenu } from "./context"

export const Menu = ({ menuIds, activeMenuId, onMenuGroupClick, onSubMenuClick, ...rest }) => (
  <Flex as="ul" role="complementary" column {...rest}>
    {menuIds.map(id => {
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
  menuIds,
  activeMenuId,
  onMenuGroupClick,
  onSubMenuClick,
  ...rest
}) => (
  <MenuSidebar {...rest}>
    <Menu
      menuIds={menuIds}
      activeMenuId={activeMenuId}
      onMenuGroupClick={onMenuGroupClick}
      onSubMenuClick={onSubMenuClick}
    />
  </MenuSidebar>
)

export const SidebarContainer = withActiveMenu(withMenu(MenuSidebarContainer))
