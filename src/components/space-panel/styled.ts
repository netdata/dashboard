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
  padding: ${getSizeBy(3)} ${getSizeBy(2)};
  background: #f1f2f3;
  transition: transform 0.2s ease-out;
  background: #f1f2f3;
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
`
