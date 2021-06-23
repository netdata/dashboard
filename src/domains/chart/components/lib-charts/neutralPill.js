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

const minTimeframe = 15
const maxTimeframe = 180

const getMissingTime = total => {
  if (total < minTimeframe) return " (Select at least 15 sec)"
  if (total > maxTimeframe) return " (Select up to 180 sec)"
  return ""
}

const NeutralPill = forwardRef((
  { isVisible, before, after },
  ref,
) => {
  const total = (before - after) / 1000
  return (
    <Container ref={ref}>
      {isVisible && (
        <Badge>
          {Math.round(total)} sec.{getMissingTime(total)}
        </Badge>
      )}
    </Container>
  )
})

export default NeutralPill
