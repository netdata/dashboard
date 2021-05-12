import styled from "styled-components"
import { Pill, getColor } from "@netdata/netdata-ui"

const getHoverColor = ({ isPlaying }) =>
  getColor(isPlaying ? ["green", "chateau"] : ["neutral", "iron"])

const StyledPill = styled(Pill).attrs(({ isPlaying }) => ({
  flavour: isPlaying ? "success" : "neutral",
}))`
  &:hover {
    background: ${getHoverColor};
    border-color: ${getHoverColor};
  }
`

export default StyledPill
