import styled from "styled-components"
import { Flex, getColor } from "@netdata/netdata-ui"

const Container = styled(Flex)`
  cursor: pointer;

  &:hover * {
    color: ${getColor("textLite")};
    fill: ${getColor("textLite")};
  }
`

export default Container
