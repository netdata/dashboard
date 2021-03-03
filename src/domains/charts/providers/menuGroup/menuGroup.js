import React, { useMemo } from "react"
import styled, { css } from "styled-components"
import { Text, Flex, getColor } from "@netdata/netdata-ui"
import { MenuItemContainer } from "domains/charts/providers/subMenu"
import { useActiveMenuId } from "domains/charts/providers/active"
import { withMenuGroup } from "./context"

const MenuGroupLabel = styled(Text).attrs({ color: "border" })`
  font-weight: "500";
`

const Icon = styled(MenuGroupLabel)`
  svg {
    width: 20px;
    text-align: center;
  }
`

const styledActive = css`
  border-left: 2px solid ${getColor("key")};
  ${MenuGroupLabel} {
    color: ${getColor("key")};
  }
`

const Container = styled(Flex)`
  &&& {
    border-left: 2px solid transparent;
    ${props => props.active && styledActive}
    ${props => props.active && `${MenuGroupLabel} { font-weight: bold; }`}

    text-decoration: none;
    &:hover {
      ${styledActive}
    }
  }
`

export const MenuGroupIcon = ({ icon }) => <Icon dangerouslySetInnerHTML={{ __html: icon }} />

export const MenuGroupItem = ({ icon, title, ...rest }) => (
  <Container as="a" gap={2} {...rest}>
    <MenuGroupIcon icon={icon} />
    <MenuGroupLabel>{title}</MenuGroupLabel>
  </Container>
)

export const SubMenus = ({ subMenuIds, onSubMenuClick, ...rest }) => {
  return (
    <Flex column role="list" {...rest}>
      {subMenuIds.map(id => (
        <MenuItemContainer
          key={id}
          id={id}
          onClick={onSubMenuClick && (e => onSubMenuClick(id, e))}
        />
      ))}
    </Flex>
  )
}

export const MenuGroup = ({
  id,
  icon,
  title,
  subMenuIds,
  link,
  active,
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
    <Flex as="li" column {...rest}>
      <MenuGroupItem
        icon={icon}
        href={`#${link}`}
        title={title}
        onClick={menuGroupClick}
        active={active}
        padding={[1, 5]}
      />
      {active && (
        <SubMenus subMenuIds={subMenuIds} onSubMenuClick={subMenuClick} padding={[0, 0, 2, 0]} />
      )}
    </Flex>
  )
}

export const withMenuActive = Component => ({ id, ...rest }) => {
  const active = useActiveMenuId(state => id === state)
  return <Component active={active} id={id} {...rest} />
}

export const MenuGroupContainer = withMenuGroup(
  withMenuActive(MenuGroup),
  ({ icon, title, subMenuIds, link, id }) => ({
    icon,
    title,
    subMenuIds,
    link,
    id,
  })
)
