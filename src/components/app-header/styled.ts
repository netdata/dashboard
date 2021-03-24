import styled from "styled-components"
import { getColor, getSizeBy, breakpoints } from "@netdata/netdata-ui"

import { appHeaderZIndex } from "styles/z-index"

export const HEADER_SIZE = 56

export const StyledHeader = styled.header`
  z-index: ${appHeaderZIndex};
  top: 0;
  left: 0;
  position: fixed;
  height: ${HEADER_SIZE}px;
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

export const IconContainer = styled.div`
  flex-shrink: 0;
  flex-grow: 0;
  position: relative;
  margin: 0 5px;
`
export const IframeContainer = styled.div`
  position: relative;
  width: 134px;
  height: 40px;
`

export const SignInButton = styled.a<{ isDisabled: boolean }>`
  padding: 8px;
  cursor: pointer;
  background-color: ${({ isDisabled }) => (isDisabled ? "rgba(0, 171, 68, 0.4);" : "#00AB44")};
  pointer-events: ${({ isDisabled }) => (isDisabled ? "none" : "auto")};
  border-color: #00ab44;
  border-style: solid;
  border-radius: 3px;
  border-width: 0;
  width: 100%;
  height: 40px;
  font-weight: bold;
  font-size: 12px;
  flex-flow: row nowrap;
  align-items: center;
  user-select: none;
  display: flex;
  text-transform: uppercase;
  justify-content: center;
  &,
  &:hover {
    color: ${getColor("bright")};
    text-decoration: none;
  }
  &:hover {
    border-color: ${getColor("accent")};
    border-width: 3px;
    border-radius: 4px;
  }
`

export const OfflineBlock = styled.div``

export const SignInIframe = styled.iframe<{ isShown: boolean }>`
  position: absolute;
  right: 0;
  border: none;
  display: ${({ isShown }) => (isShown ? undefined : "none")};
`
