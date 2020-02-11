import styled from "styled-components"
import { getSizeBy, getColor, Icon, TextNano } from "@netdata/netdata-ui"

export const NodesContainer = styled.div`
  .mdc-list-item {
    padding: 0 0;
    padding-left: 0;
  }
  .rmwc-collapsible-list__children {
    .mdc-list-item {
      padding: 0 0;
      padding-left: 0;
      height: ${getSizeBy(4)};
    }
  }
`

export const ListHeaderContainer = styled.div``

export const ListItem = styled.div`
  width: 100%;
  height: ${getSizeBy(3)};
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  cursor: pointer;
`

export const StyledIcon = styled(Icon)`
  flex-shrink: 0;
  flex-grow: 0;
  margin-right: ${getSizeBy(2)};
  fill: ${getColor(["text"])};
`

export const NodeUrl = styled(TextNano)`
  margin-left: ${getSizeBy(5)};
  color: #aeb3b7;
`
