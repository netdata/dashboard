import styled from "styled-components"
import { getColor, getSizeBy } from "@netdata/netdata-ui"

export const Divider = styled.div`
  background: ${getColor("disabled")};
  height: 1px;
  width: auto;
  margin: ${getSizeBy(1)} ${getSizeBy(3)};
`
