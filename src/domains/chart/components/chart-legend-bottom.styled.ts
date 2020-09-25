import styled from "styled-components"
import { getSizeBy, getColor } from "@netdata/netdata-ui"

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
  margin-top: 4px;
  color: ${getColor("textFocus")};
`

export const DateTimeSeparator = styled.span`
  margin: 0 3px;
`

export const LegendItems = styled.div`
  display: flex;
  flex-wrap: wrap;
`

export const DimensionItem = styled.div<{ color: string, isDisabled: boolean }>`
  display: flex;
  align-items: center;
  color: ${({ color }) => color};
  margin-right: ${getSizeBy(2)};
  cursor: pointer;
  opacity: ${({ isDisabled }) => (isDisabled ? 0.3 : null)};
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
`
