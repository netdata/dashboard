import styled from "styled-components"
import {
  H5, getColor, Button, getSizeBy,
} from "@netdata/netdata-ui"

export const RoomListContainer = styled.div``

export const RoomAddSection = styled.section`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  flex-grow: 0;
  flex-shrink: 0;
  align-items: center;
  padding: 0 ${getSizeBy(2)};
`

export const StyledAnnotation = styled(H5)`
  text-shadow: unset;
  color: ${getColor(["borderColor"])};
`

// TODO - we should have Button Small on UI Kit level probably
export const PlusButton = styled(Button)`
  width: 18px;
  height: 18px;
  padding: 0;
  margin-left: ${getSizeBy(2)};

  .button-icon {
    width: 18px;
    height: 18px;
  }

  &:hover {
    width: 18px;
    height: 18px;
    padding: 0;
    border-width: 0;
    margin-left: ${getSizeBy(2)};
  }
`
