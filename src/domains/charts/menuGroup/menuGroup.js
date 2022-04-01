import React, { forwardRef, useMemo } from "react"
import styled, { css } from "styled-components"
import { Text, Flex, getColor } from "@netdata/netdata-ui"
import { MenuItemContainer } from "domains/charts/subMenu"
import { useMenuGroupActive } from "domains/charts/active"
import { withMenuGroup } from "./context"

export const MenuGroupLabelWrapper = styled(Text).attrs({ color: "border" })`
  font-weight: "500";
`

const Icon = styled(MenuGroupLabelWrapper)`
  svg {
    width: 20px;
    text-align: center;
  }
`

const styledActive = css`
  border-left: 2px solid ${getColor("key")};
  ${MenuGroupLabelWrapper} {
    color: ${getColor("key")};
  }
`

const Container = styled(Flex)`
  &&& {
    border-left: 2px solid transparent;
    ${props => props.active && styledActive}
    ${props =>
      props.active && `${MenuGroupLabelWrapper} { font-weight: bold; }`}

    text-decoration: none;
    &:hover {
      ${styledActive}
    }
  }
`

export const MenuGroupLabelContainer = withMenuGroup(MenuGroupLabelWrapper, ({ title }) => ({
  children: title,
}))

export const MenuGroupIcon = ({ icon }) => <Icon dangerouslySetInnerHTML={{ __html: icon }} />

export const MenuGroupIconContainer = withMenuGroup(MenuGroupIcon, ({ icon }) => ({ icon }))

export const MenuGroupItemWrapper = forwardRef(({ id, ...rest }, ref) => (
  <Container ref={ref} as="a" gap={2} padding={[1, 2]} data-sidebar-menugroupid={id} {...rest} />
))

export const MenuGroupItemContainer = withMenuGroup(MenuGroupItemWrapper, ({ id, link }) => ({
  id,
  href: `#${link}`,
}))

export const MenuGroupItem = ({ id, ...rest }) => (
  <MenuGroupItemContainer id={id} {...rest}>
    <MenuGroupIconContainer id={id} />
    <MenuGroupLabelContainer id={id} />
  </MenuGroupItemContainer>
)

export const SubMenus = ({ subMenuIds, onSubMenuClick, ...rest }) => (
  <Flex column role="list" padding={[0, 0, 2, 0]} {...rest}>
    {subMenuIds.map(id => (
      <MenuItemContainer key={id} id={id} onSubMenuClick={onSubMenuClick} />
    ))}
  </Flex>
)

export const SubMenusContainer = withMenuGroup(SubMenus, ({ subMenuIds }) => ({ subMenuIds }))

export const MenuGroupWrapper = forwardRef((props, ref) => (
  <Flex as="li" column ref={ref} {...props} />
))

export const withMenuGroupClickHandlers = Component => ({
  id,
  onMenuGroupClick,
  onSubMenuClick,
  ...rest
}) => {
  const menuGroupClick = useMemo(() => onMenuGroupClick && (e => onMenuGroupClick(id, e)), [
    onMenuGroupClick,
    id,
  ])
  const subMenuClick = useMemo(
    () => onSubMenuClick && ((subMenuId, e) => onSubMenuClick(id, subMenuId, e)),
    [onSubMenuClick, id]
  )

  return (
    <Component id={id} onMenuGroupClick={menuGroupClick} onSubMenuClick={subMenuClick} {...rest} />
  )
}

export const MenuGroup = ({ id, active, onMenuGroupClick, onSubMenuClick, ...rest }) => (
  <MenuGroupWrapper {...rest}>
    <MenuGroupItem id={id} onClick={onMenuGroupClick} active={active} />
    {active && <SubMenusContainer id={id} onSubMenuClick={onSubMenuClick} />}
  </MenuGroupWrapper>
)

export const withMenuActive = Component => ({ id, ...rest }) => {
  const active = useMenuGroupActive(id)
  return <Component active={active} id={id} {...rest} />
}

export const MenuGroupContainer = withMenuActive(withMenuGroupClickHandlers(MenuGroup))
