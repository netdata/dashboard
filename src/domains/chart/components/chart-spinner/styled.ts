import { prop } from "ramda"
import styled, { keyframes } from "styled-components"

import { getColor } from "@netdata/netdata-ui"

const spinnerAnimation = keyframes`
  to {
    transform: rotate(360deg);
  }
`

export const GifSpinnerContainer = styled.div<{ margin: number }>`
  position: absolute;
  top: ${prop("margin")}px;
  right: ${prop("margin")}px;
`

const clockRadius = 8
const clockLine = 1
const clockColor = "border"


export const ChartSpinner = styled.div<{ margin: number }>`
  position: absolute;
  top: ${prop("margin")}px;
  right: ${prop("margin")}px;
  
  width: ${clockRadius * 2}px;
  height: ${clockRadius * 2}px;
  background-color: rgba(0, 0, 0, 0);
  box-shadow: inset 0 0 0 ${clockLine}px ${getColor(clockColor)};
  border-radius: 50%;
  
  &:after {
    position: absolute;
    content: "";
    transform-origin: ${clockLine / 2}px ${clockLine / 2}px;
    background-color: ${getColor(clockColor)};
    height: ${clockLine}px;
    top: ${clockRadius - clockLine / 2}px;
    left: ${clockRadius - clockLine / 2}px;
  }
  
  &:after {
    width: ${clockRadius * (5 / 6)}px;
    animation: ${spinnerAnimation} 0.6s linear infinite;
  }
`
