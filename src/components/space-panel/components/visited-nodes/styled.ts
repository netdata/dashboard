import styled from "styled-components"
import { getSizeBy, getColor, Icon } from "@netdata/netdata-ui"

export const NodesContainer = styled.section`
  position: relative;
  margin-top: ${getSizeBy(2)};
  &::before {
    position: absolute;
    content: "";
    width: ${getSizeBy(10)};
    height: 1px;
    top: 0;
    left: calc(50% - ${getSizeBy(10)} / 2);
    background: ${getColor(["borderColor"])};
  }
`

export const ListHeaderContainer = styled.div`
  .mdc-list-item {
    padding: 0 0;
  }
`

export const ListItem = styled.div`
  width: 100%;
  height: ${getSizeBy(5)};
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  cursor: pointer;
`

export const StyledIcon = styled(Icon)`
  margin-right: ${getSizeBy(2)};
  fill: ${getColor(["text"])};
`
