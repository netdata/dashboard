import styled from "styled-components"
import { Flex } from "@netdata/netdata-ui"

const Container = styled(Flex).attrs({
  as: "ul",
  position: "relative",
  background: "mainBackground",
  column: true,
  padding: [6, 0],
  margin: [2, 0, 0],
  border: { side: "all", color: "disabled" },
  round: 2,
  gap: 4,
  zIndex: 25,
})`
  box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14),
    0 3px 14px 2px rgba(0, 0, 0, 0.12);
  list-style-type: none;
`

export default Container
