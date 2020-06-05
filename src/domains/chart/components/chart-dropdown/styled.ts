import styled from "styled-components"
import {
  getColor, Icon,
} from "@netdata/netdata-ui"

import { grayLimedSpruce, graySilverSand } from "styles/layout-constants"

export const DropdownItem = styled.div`
  display: flex;
  flex-direction: start;
  align-items: center;
  color: ${getColor(grayLimedSpruce)};
  white-space: nowrap;
  & > svg use {
      fill: ${getColor(grayLimedSpruce)};
  }
`

export const DropdownItemLabel = styled.span`
  margin-left: 12px;
`

export const DotsBtn = styled(Icon)`
  width: 6px;
  height: 10px;
  cursor: pointer;
  & use {
    fill: ${getColor(grayLimedSpruce)};
    & :hover {
      fill: ${getColor(graySilverSand)};
    }
  }
`
