import React, { memo } from "react"
import styled from "styled-components"
import { Flex } from "@netdata/netdata-ui"
import { useContainer } from "domains/charts/charts"
import { withMenuGroupIds } from "./context"
import { MenuGroupContainer } from "./menuGroup"

export const Menu = memo(({ menuGroupIds, onMenuGroupClick, onSubMenuClick, ...rest }) => (
  <Flex as="ul" role="complementary" column {...rest}>
    {menuGroupIds.map(id => (
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

export const MenuSidebarContainer = ({
  menuGroupIds,
  onMenuGroupClick,
  onSubMenuClick,
  ...rest
}) => {
  const container = useContainer()
  const top = `${container.getBoundingClientRect().top}px`

  return (
    <MenuSidebar top={top} {...rest}>
      <Menu
        menuGroupIds={menuGroupIds}
        onMenuGroupClick={onMenuGroupClick}
        onSubMenuClick={onSubMenuClick}
      />
    </MenuSidebar>
  )
}

export const SidebarContainer = memo(withMenuGroupIds(MenuSidebarContainer))
