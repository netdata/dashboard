import React, { forwardRef } from "react"
import styled from "styled-components"

export const getBackgroundColor = (status) => ({
  WARNING: "#FFF8E1",
  CRITICAL: "#FFEBEF",
  CLEAR: "#E5F5E8",
})[status] || null

export const getBorderColor = (status) => ({
  WARNING: "#FFC300",
  CRITICAL: "#F59B9B",
  CLEAR: "#68C47D",
})[status] || null

export const getColor = (status) => ({
  WARNING: "#536775",
  CRITICAL: "#FF4136",
  CLEAR: "#00AB44",
})[status] || null

const Container = styled.div`
  position: absolute;
  margin-right: 10px;
  overflow: hidden;
  pointer-events: none;
  direction: rtl;
`

const Badge = styled.div`
  display: inline-block;
  border-radius: 36px;
  padding: 2px 12px;
  background: ${({ background }) => background};
  border: 1px solid ${({ border }) => border};
  color: ${({ color }) => color};
  font-size: 12px;
  font-weight: 700;
`

export default forwardRef((
  { status, label },
  ref,
) => (
  <Container ref={ref}>
    <Badge
      background={getBackgroundColor(status)}
      border={getBorderColor(status)}
      color={getColor(status)}
    >
      {label}
    </Badge>
  </Container>
))
