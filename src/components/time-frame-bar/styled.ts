import styled from "styled-components"
import { getSizeBy } from "@netdata/netdata-ui"

const barHeight = 7

export const Bar = styled.div`
  height: ${getSizeBy(barHeight * 2)};
  width: 100%;
  background: #353F47; // not from netdata-ui, because that color will be obsolete soon anyway
  padding: ${getSizeBy(barHeight)} ${getSizeBy(2)} 0;
  border-bottom: 1px solid black;
  border-top: 1px solid black;
  z-index: 4;
  align-items: center;
  justify-content: flex-end;
`
