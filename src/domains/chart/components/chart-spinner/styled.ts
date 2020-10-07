import { prop } from "ramda"
import styled, { keyframes } from "styled-components"

import { getColor } from "@netdata/netdata-ui"

const svgSpinnerAnimation = keyframes`
  0% {
   transform: translate(10px,10px) rotate(0deg) translate(-10px,-10px);
  }
  100% {
   transform: translate(10px,10px) rotate(350deg) translate(-10px,-10px);
  }
`

export const GifSpinnerContainer = styled.div<{ top: number, right: number }>`
  position: absolute;
  top: ${prop("top")}px;
  right: ${prop("right")}px;
  opacity: .5;
`

export const SvgSpinner = styled.g`
  animation: 1s linear infinite both ${svgSpinnerAnimation};
`

export const SvgSpinnerPath = styled.path`
  fill: ${getColor("border")};
`

export const SvgCircle = styled.path`
  fill: ${getColor("border")};
`
