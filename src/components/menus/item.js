import React, { useCallback, forwardRef } from "react"
import styled from "styled-components"
import { getColor, Flex, Icon, Text } from "@netdata/netdata-ui"

export const PanelRowContainer = styled(Flex)`
  cursor: pointer;

  &:hover {
    background: ${getColor("selected")};
  }

  ${props => props.selected && `background: ${getColor("selected")(props)};`}
`

const MenuItem = forwardRef(
  (
    {
      disabled,
      children,
      Wrapper = Text,
      onClick,
      testid,
      icon,
      padding = [2, 3],
      margin = [0],
      round = 0,
      actions,
      selected,
      width = "100%",
    },
    ref
  ) => {
    const click = useCallback(() => {
      if (disabled) return
      if (onClick) onClick()
    }, [onClick, disabled])

    return (
      <PanelRowContainer
        ref={ref}
        flexWrap={false}
        justifyContent="between"
        alignItems="center"
        padding={padding}
        margin={margin}
        round={round}
        onClick={click}
        data-testid={testid}
        width={width}
        selected={selected}
        disabled={disabled}
      >
        <Flex alignItems="center" gap={3} flex basis="">
          {typeof icon === "string" ? (
            <Icon name={icon} disabled={disabled} color="text" height="16px" width="16px" />
          ) : (
            icon
          )}
          <Wrapper opacity={disabled ? "medium" : undefined} width="150px">
            {children}
          </Wrapper>
        </Flex>
        {actions}
      </PanelRowContainer>
    )
  }
)

export default MenuItem
