import React, { forwardRef } from "react"
import styled from "styled-components"

const backgroundColorMap = {
  WARNING: "#FFF8E1",
  CRITICAL: "#FFEBEF",
  CLEAR: "#E5F5E8",
}
export const getBackgroundColor = (status) => backgroundColorMap[status] || null

const borderColorMap = {
  WARNING: "#FFC300",
  CRITICAL: "#F59B9B",
  CLEAR: "#68C47D",
}
export const getBorderColor = (status) => borderColorMap[status] || null

const textColorMap = {
  WARNING: "#536775",
  CRITICAL: "#FF4136",
  CLEAR: "#00AB44",
}
export const getColor = (status) => textColorMap[status] || null

const Container = styled.div`
  position: absolute;
  margin-right: 10px;
  overflow: hidden;
  pointer-events: none;
  direction: rtl;
  z-index: 10; // higher than chart
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
  direction: ltr;
  white-space: nowrap;
`

export default forwardRef((
  { isVisible, status, label },
  ref,
) => (
  <Container ref={ref}>
    {isVisible && (
      <Badge
        background={getBackgroundColor(status)}
        border={getBorderColor(status)}
        color={getColor(status)}
      >
        {label}
      </Badge>
    )}
  </Container>
))
