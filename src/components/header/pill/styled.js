import styled from "styled-components"
import { Flex } from "@netdata/netdata-ui"

const hollowColors = {
  warning: "#FFF8E1",
  error: "#FFEBEF",
}

const StyledPill = styled(Flex).attrs(({ round = 999, hollow, background }) => ({
  padding: [0.5, 2],
  round,
  border: hollow ? { side: "all", color: background, size: "1px" } : false,
}))`
  background: ${({ background, hollow }) => (hollow ? hollowColors[background] : background)}
  cursor: pointer;
`

export default StyledPill
