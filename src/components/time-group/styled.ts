import styled from "styled-components"
import { getColor, getSizeBy } from "@netdata/netdata-ui"

// matches cloud-fe components
export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
`

export const TimeButton = styled.button<{ isSelected: boolean }>`
  display: flex;
  width: ${getSizeBy(5)};
  height: 20px;
  opacity: ${({ isSelected }) => (isSelected ? 1 : 0.6)};
  justify-content: center;
  align-items: center;
  background: none;
  border: none;
  padding: 0;
  color: ${({ isSelected }) => getColor(isSelected ? "bright" : "text")};
  margin: ${getSizeBy(0.5)};
  font: inherit;
  cursor: pointer;
  outline: inherit;
  border-radius: 2px;
  font-size: 14px;
  line-height: 18px;
  background-color: ${({ isSelected }) => getColor(isSelected ? "tooltip" : "borderSecondary")};
  &:hover {
    background-color: ${getColor("border")};
    color: ${getColor("bright")};
    font-size: 14px;
    line-height: 18px;
  }
`
