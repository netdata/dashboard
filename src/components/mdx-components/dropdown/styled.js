import styled from "styled-components"
import { getColor, getSizeBy, Icon } from "@netdata/netdata-ui"
import { Menu } from "@rmwc/menu"

export const RootContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
`

export const StyledMenu = styled(Menu)``

export const DropdownContainer = styled.div`
  cursor: pointer;
  color: ${getColor("bright")};
  .mdc-menu-surface {
    border-radius: 0;
    .mdc-list {
      padding: 0;
    }
    .mdc-list-item {
      padding: 0 ${getSizeBy(5)} 0 ${getSizeBy(5)};
      font-size: 14px;
      height: ${getSizeBy(6)};
    }
  }
`

export const ListContainer = styled.div`
  padding: ${getSizeBy(3)} 0;
`

export const OpenerIcon = styled(Icon)`
  flex-shrink: 0;
  flex-grow: 0;
  margin-left: ${({ noMargin }) => (noMargin ? "unset" : "16px")};
  fill: ${getColor("bright")};
  width: 10px;
  height: 5px;
`
