import styled from "styled-components"
import { getSizeBy, getColor, H4 } from "@netdata/netdata-ui"

export const PanelContainer = styled.aside<{ isActive: boolean }>`
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
  padding: ${getSizeBy(3)} 0;
  background: #f1f2f3;
  transition: transform 0.2s ease-out;
  border-right: 1px solid ${getColor(["borderColor"])};
`

export const ScrollContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 ${getSizeBy(2)};
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
