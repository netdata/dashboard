import styled from "styled-components"
import { getSizeBy } from "@netdata/netdata-ui"

export const NodeIconContainer = styled.div`
  width: ${getSizeBy(5)};
  height: ${getSizeBy(5)};
  margin-right: ${getSizeBy(2)};
  display: flex;
  justify-content: center;
  align-items: center;
`

export const NotificationLink = styled.a`
  &,
  &:hover {
    text-decoration: underline;
    color: inherit;
  }
`
