import React, { memo, forwardRef } from "react"
import styled from "styled-components"
import { Flex, Text } from "@netdata/netdata-ui"
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

const StyledText = styled(Text)`
  line-height: 25px;
`

const NodeInfo = memo(({ showCounters, chartsCount, metricsCount, alarmsCount, nodeName }) => {
  const shouldShowCounters = showCounters && chartsCount && metricsCount && alarmsCount

  if (!shouldShowCounters) return null
  return (
    <StyledText margin={[5]} color="textLite">
      Every second, Netdata collects
      <Text strong color="textLite" margin={[0, 1]}>
        {metricsCount}
      </Text>
      metrics on {nodeName}, presents them in
      <Text strong color="textLite" margin={[0, 1]}>
        {chartsCount}
      </Text>
      charts, and monitors them with
      <Text strong color="textLite" margin={[0, 1]}>
        {alarmsCount}
      </Text>
      alarms.
    </StyledText>
  )
})

export const MenuSidebarContainer = ({
  onMenuGroupClick,
  onSubMenuClick,
  isFixedPosition = true,
  ...rest
}) => {
  const { showCounters, chartsCount, metricsCount, alarmsCount, nodeName } = rest

  return (
    <MenuSidebar isFixedPosition={isFixedPosition} {...rest}>
      <MenuContainer onMenuGroupClick={onMenuGroupClick} onSubMenuClick={onSubMenuClick} />
      <NodeInfo
        nodeName={nodeName}
        chartsCount={chartsCount}
        metricsCount={metricsCount}
        alarmsCount={alarmsCount}
        showCounters={showCounters}
      />
    </MenuSidebar>
  )
}

export const SidebarContainer = memo(MenuSidebarContainer)
