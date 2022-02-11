import styled from "styled-components"
import { Flex } from "@netdata/netdata-ui"

const Dropdown = styled(Flex).attrs({
  padding: [4],
  background: "dropdown",
  round: 1,
  overflow: { vertical: "auto" },
  margin: [4, 0, 0],
  width: 110,
})`
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`

export default Dropdown
