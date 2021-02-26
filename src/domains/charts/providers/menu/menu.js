import React, { memo } from "react"
import styled from "styled-components"
import { Flex } from "@netdata/netdata-ui"
import { MenuGroupContainer } from "domains/charts/providers/menuGroup"
import { useContainer } from "domains/charts/providers/charts"
import { withActiveMenu } from "domains/charts/providers/active"
import { withMenu } from "./context"

export const Menu = memo(({ menuIds, activeMenuId, onMenuGroupClick, onSubMenuClick, ...rest }) => (
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
))

export const MenuSidebar = styled(Flex).attrs({
  overflow: { vertical: "auto" },
})`
  position: fixed;
  top: ${({ top }) => top};
  right: 12px;
  bottom: 12px;
  max-height: calc(100vh - ${({ top }) => top});
`

export const MenuSidebarContainer = ({
  menuIds,
  activeMenuId,
  onMenuGroupClick,
  onSubMenuClick,
  ...rest
}) => {
  const container = useContainer()
  const top = `${container.getBoundingClientRect().top}px`

  return (
    <MenuSidebar top={top} {...rest}>
      <Menu
        menuIds={menuIds}
        activeMenuId={activeMenuId}
        onMenuGroupClick={onMenuGroupClick}
        onSubMenuClick={onSubMenuClick}
      />
    </MenuSidebar>
  )
}

export const SidebarContainer = withActiveMenu(withMenu(MenuSidebarContainer))
