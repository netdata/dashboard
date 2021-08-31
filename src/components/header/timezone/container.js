import styled from "styled-components"
import { Flex } from "@netdata/netdata-ui"

const Container = styled(Flex).attrs({
  column: true,
  padding: [2, 0, 0],
  overflow: { vertical: "auto" },
  height: { max: "320px" },
})``

export default Container
