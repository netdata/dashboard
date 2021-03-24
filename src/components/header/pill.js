import React, { forwardRef } from "react"
import styled from "styled-components"
import { Flex, TextMicro } from "@netdata/netdata-ui"

const StyledPill = styled(Flex).attrs({
  padding: [0.5, 1],
  round: 1,
})`
  cursor: pointer;
`

const Pill = forwardRef(({ children, background, color, ...rest }, ref) => (
  <StyledPill background={background} ref={ref} {...rest}>
    <TextMicro color={color} strong>
      {children}
    </TextMicro>
  </StyledPill>
))

export default Pill
