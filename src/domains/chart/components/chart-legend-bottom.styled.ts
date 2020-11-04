import styled from "styled-components"
import { getSizeBy } from "@netdata/netdata-ui"

export const LegendContainer = styled.div`
  margin-bottom: ${getSizeBy(3)};
`

export const LegendFirstRow = styled.div`
  margin-top: 4px;
  display: flex;
  justify-content: space-between;
`

export const LegendSecondRow = styled.div`
  margin-top: 4px;
  display: flex;
  justify-content: space-between;
`

export const LegendUnit = styled.div`
`

export const DateTimeSeparator = styled.span`
  margin: 0 3px;
`

export const LegendItems = styled.div`
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
  max-height: 80px;
`

export const DimensionItem = styled.div<{ color: string, isDisabled: boolean }>`
  display: flex;
  align-items: center;
  color: ${({ color }) => color};
  margin-right: ${getSizeBy(2)};
  cursor: pointer;
  opacity: ${({ isDisabled }) => (isDisabled ? 0.3 : null)};
  user-select: none;
  &:focus {
    outline: none;
  }
`

// toolbox is based on "absolute", so to make sure it's not put on top of dimension-item
// let's put a transparent block as last in dimension-items container. Toolbox will soon be moved
// to other place so it's temporary
export const DimensionItemToolboxPlaceholder = styled.div`
  width: 140px;
  height: 20px;
`

export const DimensionIcon = styled.div<{ color: string }>`
  width: ${getSizeBy(2)};
  height: ${getSizeBy(1)};
  border-radius: 4px;
  overflow: hidden;
  background-color: ${({ color }) => color};
`

export const DimensionLabel = styled.span`
  margin-left: 3px;
`

export const DimensionValue = styled.span`
  margin-left: 5px;
  min-width: 30px;
`

export const ToolboxContainer = styled.div`
  position: relative;
  touch-action: none;
`
