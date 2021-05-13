import styled from "styled-components"
import { getColor, Icon } from "@netdata/netdata-ui"

export const DropdownItem = styled.div`
  display: flex;
  flex-direction: start;
  align-items: center;
  color: ${getColor(["neutral", "limedSpruce"])};
  white-space: nowrap;
  & > svg use {
    fill: ${getColor(["neutral", "limedSpruce"])};
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
    fill: ${getColor(["neutral", "limedSpruce"])};
    & :hover {
      fill: ${getColor(["neutral", "regentgrey"])};
    }
  }
`
