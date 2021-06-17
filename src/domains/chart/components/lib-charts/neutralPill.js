import React, { forwardRef } from "react"
import styled from "styled-components"
import { getColor } from "@netdata/netdata-ui"

const Container = styled.div`
  position: absolute;
  margin-right: 10px;
  overflow: hidden;
  pointer-events: none;
  direction: rtl;
  z-index: 10;
`

const Badge = styled.div`
  display: inline-block;
  border-radius: 36px;
  padding: 2px 12px;
  background: ${getColor("mainBackground")};
  border: 1px solid ${getColor("border")};
  color: ${getColor("text")};
  font-size: 12px;
  font-weight: 700;
  direction: ltr;
  white-space: nowrap;
`

const NeutralPill = forwardRef((
  { isVisible, before, after },
  ref,
) => {
  return (
    <Container ref={ref}>
      {isVisible && (
        <Badge>
          {Math.round((before - after) / 1000)} sec.
        </Badge>
      )}
    </Container>
  )
})

export default NeutralPill
