import styled from "styled-components"
import { Flex } from "@netdata/netdata-ui"

const Anchor = styled(Flex).attrs({
  as: "a",
  gap: 2,
  alignItems: "center",
})`
  & :hover {
    text-decoration: none;
  }
`

export default Anchor
