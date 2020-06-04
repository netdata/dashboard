import styled from "styled-components"
import {
  getColor, getSizeBy, Text, Icon, TextNano,
} from "@netdata/netdata-ui"

export const StyledIcon = styled(Icon)`
  fill: ${getColor(["text"])};
  margin-right: ${getSizeBy()};
`

export const Container = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  height: ${getSizeBy(4)};
  cursor: pointer;
  padding: 0 ${getSizeBy(2)};
  &:hover {
    background: #e0e0e0;
  }
`

export const RoomName = styled(Text)`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  white-space: nowrap;
`

export const IndicatorsContainer = styled.div`
  flex-grow: 0;
  flex-shrink: 0;
  margin-left: auto;
  display: flex;
  flex-flow: row nowrap;
`

export const ErrorIndicator = styled.div`
  flex-shrink: 0;
  flex-grow: 0;
  width: 12px;
  height: 12px;
  margin-right: 4px;
  border-radius: 50%;
  background: ${getColor(["error"])};
  display: flex;
  justify-content: center;
  align-items: center;
`

export const WarningIndicator = styled(ErrorIndicator)`
  background: ${getColor(["warning"])};
`
export const UnreachableIndicator = styled(ErrorIndicator)`
  background: ${getColor(["gray", "bombay"])};
`

export const StyledCount = styled(TextNano)`
  color: ${getColor(["white", "pure"])};
`

export const UnreachableCount = styled(TextNano)``
