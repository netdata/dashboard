import styled from "styled-components"
import { getSizeBy, getColor, H4 } from "@netdata/netdata-ui"

const PANEL_CONTAINER_PADDING = 3
export const PanelContainer = styled.aside<{ isActive: boolean, isSignedIn: boolean }>`
  position: fixed;
  z-index: 3;
  left: 56px;
  transform: ${({ isActive }) => (isActive ? "translateX(0)" : "translateX(-100%)")};
  top: 56px;
  height: calc(100vh - 56px);
  width: ${getSizeBy(28)};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: ${getColor(["text"])};
  padding: ${({ isSignedIn, theme }) => (
    isSignedIn ? 0 : getSizeBy(PANEL_CONTAINER_PADDING)({ theme })
  )} 0;
  background: #f1f2f3;
  transition: transform 0.2s ease-out;
  border-right: 1px solid ${getColor(["borderColor"])};
`

export const ScrollContainer = styled.div`
  flex: 1;
  overflow-y: auto;
`

export const PanelHeader = styled(H4)`
  flex-grow: 0;
  flex-shrink: 0;
  margin-bottom: ${getSizeBy(3)};
  padding: 0 ${getSizeBy(2)};
  text-shadow: unset;
`

export const PanelSection = styled.section<{ leading?: boolean }>`
  position: relative;
  margin-top: ${({ leading }) => !leading && getSizeBy(2)};

  &::before {
    ${({ leading }) => (leading ? "display: none" : "")};
    position: absolute;
    content: "";
    width: ${getSizeBy(10)};
    height: 1px;
    top: 0;
    left: calc(50% - ${getSizeBy(10)} / 2);
    background: ${getColor(["borderColor"])};
  }
`

export const BottomPanelContainer = styled.div`
  flex: 0 1 auto;
  margin-bottom: ${getSizeBy(-PANEL_CONTAINER_PADDING)};
  bottom: 0;
  background: #FFF;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`

export const SwitchIdentity = styled.div`
  line-height: 40px;
  border-top: 1px solid #AEB3B7;
  background: #FFF;
  width: 100%;
  cursor: pointer;
`

export const BottomPanel = styled.div`
  border-top: 1px solid #AEB3B7;
  background: #FFF;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  flex: 1 0 auto;
  padding: 20px 30px;
  height: 224px;
`

export const CantConnect = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #35414A;
  max-width: 140px;
`

export const BottomPanelHeader = styled.div`
  font-weight: bold;
  font-size: 12px;
`

export const BottomPanelText = styled.div`
  line-height: 17px;
  font-size: 13px;
  max-width: 165px;
`

export const OfflineDescription = styled.div`
  color: #AEB3B7;
  font-size: 9px;
  line-height: 12px;
  max-width: 170px;
`

export const SignInButton = styled.a`
  padding: 8px;
  opacity: 1;
  cursor: pointer;
  background-color: #00AB44;
  border-color: #00AB44;
  border-style:solid;
  border-radius: 3px;
  border-width: 0;
  width: 128px;
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
`

export const NoNetworkIcon = styled.svg`
  height: 68px;
`
