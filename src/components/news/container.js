import styled from "styled-components"
import { Flex, webkitVisibleScrollbar } from "@netdata/netdata-ui"

export const Container = styled(Flex).attrs({
  overflow: { vertical: "auto" },
  padding: [0, 4, 0, 0],
})`
  ${webkitVisibleScrollbar}
`
