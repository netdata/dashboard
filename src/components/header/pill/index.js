import React, { forwardRef } from "react"
import { TextMicro } from "@netdata/netdata-ui"
import StyledPill from "./styled"

const Pill = forwardRef(({ children, background, color, hollow, ...rest }, ref) => (
  <StyledPill background={background} hollow={hollow} ref={ref} {...rest}>
    <TextMicro color={hollow ? background : color} strong>
      {children}
    </TextMicro>
  </StyledPill>
))

export default Pill
