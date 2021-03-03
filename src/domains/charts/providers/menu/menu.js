import React, { memo } from "react"
import styled from "styled-components"
import { Flex } from "@netdata/netdata-ui"
import { MenuGroupContainer } from "domains/charts/providers/menuGroup"
import { useContainer } from "domains/charts/providers/charts"
import { withMenu } from "./context"

export const Menu = memo(({ menuIds, onMenuGroupClick, onSubMenuClick, ...rest }) => (
  <Flex as="ul" role="complementary" column {...rest}>
    {menuIds.map(id => (
      <MenuGroupContainer
        key={id}
        id={id}
        onMenuGroupClick={onMenuGroupClick}
        onSubMenuClick={onSubMenuClick}
      />
    ))}
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

export const MenuSidebarContainer = ({ menuIds, onMenuGroupClick, onSubMenuClick, ...rest }) => {
  const container = useContainer()
  const top = `${container.getBoundingClientRect().top}px`

  return (
    <MenuSidebar top={top} {...rest}>
      <Menu menuIds={menuIds} onMenuGroupClick={onMenuGroupClick} onSubMenuClick={onSubMenuClick} />
    </MenuSidebar>
  )
}

export const SidebarContainer = memo(withMenu(MenuSidebarContainer))
