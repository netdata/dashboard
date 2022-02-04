import React, { memo, forwardRef } from "react"
import styled from "styled-components"
import { Flex } from "@netdata/netdata-ui"
import { useContainer } from "domains/charts/charts"
import { withMenuGroupIds } from "./context"
import { MenuGroupContainer } from "./menuGroup"

export const MenuWrapper = forwardRef((props, ref) => (
  <Flex as="ul" width="100%" role="complementary" column ref={ref} {...props} />
))

export const Menu = memo(({ menuGroupIds, onMenuGroupClick, onSubMenuClick, ...rest }) => (
  <MenuWrapper {...rest}>
    {menuGroupIds.map(id => (
      <MenuGroupContainer
        key={id}
        id={id}
        onMenuGroupClick={onMenuGroupClick}
        onSubMenuClick={onSubMenuClick}
      />
    ))}
  </MenuWrapper>
))

export const MenuContainer = withMenuGroupIds(Menu)

const StyledMenuSidebar = styled(Flex).attrs({
  overflow: { vertical: "auto" },
})`
  position: fixed;
  top: ${({ top }) => top};
  right: 12px;
  bottom: 12px;
  max-height: calc(100vh - ${({ top }) => top});
`

export const MenuSidebar = props => {
  const container = useContainer()
  const top = `${container.getBoundingClientRect().top}px`
  return props.isFixedPosition ? <StyledMenuSidebar top={top} {...props} /> : <Flex {...props} />
}

export const MenuSidebarContainer = ({
  onMenuGroupClick,
  onSubMenuClick,
  isFixedPosition = true,
  ...rest
}) => (
  <MenuSidebar isFixedPosition={isFixedPosition} {...rest}>
    <MenuContainer onMenuGroupClick={onMenuGroupClick} onSubMenuClick={onSubMenuClick} />
  </MenuSidebar>
)

export const SidebarContainer = memo(MenuSidebarContainer)
