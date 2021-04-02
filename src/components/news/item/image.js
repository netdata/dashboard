import styled from "styled-components"
import { Flex } from "@netdata/netdata-ui"

const Image = styled(Flex).attrs({ as: "img" })`
  object-fit: cover;
`
export default Image
