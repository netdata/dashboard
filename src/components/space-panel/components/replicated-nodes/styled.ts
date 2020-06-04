import styled from "styled-components"
import {
  getSizeBy, getColor, Icon, Text,
} from "@netdata/netdata-ui"

export const NodesContainer = styled.div`
  .mdc-list-item {
    padding: 0 0;
    padding-left: 0;
  }
  .rmwc-collapsible-list__handle {
    .mdc-list-item {
      padding: 0 ${getSizeBy(2)};
    }
  }
`

export const ListHeaderContainer = styled.div``

export const ListItem = styled.div`
  width: 100%;
  max-width: 100%;
  height: ${getSizeBy(4)};
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding-left: ${getSizeBy(4)};
  overflow: hidden;
`

export const NodeLink = styled(Text)`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  white-space: nowrap;
  color: inherit;
  &:hover {
    color: inherit
  }
`.withComponent("a")

export const StyledIcon = styled(Icon)`
  flex-shrink: 0;
  flex-grow: 0;
  margin-right: ${getSizeBy(2)};
  fill: ${getColor(["text"])};
`

export const MasterNodeContainer = styled.div`
  display: flex;
  align-items: center;
  height: ${getSizeBy(4)};
  flex-flow: row nowrap;
  padding: 0 ${getSizeBy(2)};
`
