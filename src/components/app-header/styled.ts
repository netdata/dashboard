import styled from "styled-components"
import {
  getColor, getSizeBy, Button, breakpoints,
} from "@netdata/netdata-ui"

const appHeaderZIndex = 5

export const StyledHeader = styled.header`
  z-index: ${appHeaderZIndex};
  top: 0;
  left: 0;
  position: fixed;
  height: 56px;
  width: 100%;
  background: ${getColor(["gray", "limedSpruce"])};
  display: flex;
  flex-flow: row nowrap;

  @media ${breakpoints.laptop} {
    padding-right: ${getSizeBy()};
  }

  @media ${breakpoints.laptopLarge} {
    padding-right: ${getSizeBy(3)};
  }
  
  @media print {
    display: none;
  }
`

export const CollapsableSection = styled.section`
  flex-grow: 1;
  flex-shrink: 1;
  display: flex;
  flex-flow: row nowrap;
`

export const NavigationSection = styled.section`
  position: relative;
  flex-grow: 0;
  flex-shrink: 1;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: 0 ${getSizeBy(3)};
`

export const WhiteSpaceSection = styled.section`
  flex: 1;
`

export const UtilitySection = styled.section`
  padding-left: 4px;
  height: 100%;
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-end;

  @media ${breakpoints.laptop} {
    padding-left: ${getSizeBy()};
  }
  @media ${breakpoints.laptopLarge} {
    padding-left: ${getSizeBy(2)};
  }
`

export const StyledGear = styled(Button)`
  fill: ${getColor(["white", "pure"])};
`

export const StyledGearContainer = styled.a`
  padding: 0;
`

export const IconContainer = styled.div`
  flex-shrink: 0;
  flex-grow: 0;
  position: relative;
  margin: 0 5px;
`
export const IframeContainer = styled.div`
  width: 84px;
  height: 40px;
`

export const StyledHelpIcon = styled.a`
  font-size: 16px;
`

export const SignInButton = styled.a<{ isDisabled: boolean }>`
  padding: 8px;
  cursor: pointer;
  background-color: ${({ isDisabled }) => (isDisabled ? "rgba(0, 171, 68, 0.4);" : "#00AB44")};
  pointer-events: ${({ isDisabled }) => (isDisabled ? "none" : "auto")};
  border-color: #00AB44;
  border-style:solid;
  border-radius: 3px;
  border-width: 0;
  width: 100%;
  height: 40px;
  font-weight: bold;
  font-size: 12px;
  color: #FFF;
  flex-flow: row nowrap;
  align-items: center;
  text-decoration: none;
  user-select: none;
  display: flex;
  text-transform: uppercase;
  justify-content: center;
  &:hover {
    border-color: #00CB51;
    border-width: 3px;
    border-radius: 4px;
    text-decoration: none;
  }
`

export const OfflineBlock = styled.div``
