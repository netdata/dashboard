import { prop } from "ramda"
import styled, { keyframes } from "styled-components"

import { getColor } from "@netdata/netdata-ui"

const circleAnimation = keyframes`
  0% {
   opacity: .1;
  }
  50% {
    opacity: .5;
  }
  100% {
   opacity: .1;
  }
`


export const SpinnerContainer = styled.div<{ top: number, right: number }>`
  position: absolute;
  top: ${prop("top")}px;
  right: ${prop("right")}px;
  display: flex;
`

export const Circle = styled.div<{ size: number }>`
  width: ${prop("size")}px;
  height: ${prop("size")}px;
  background: ${getColor("border")};
  border-radius: 50%;
  animation: 1s linear infinite both ${circleAnimation};
`

export const Circle2 = styled(Circle)<{ spaceBetween: number }>`
  animation-delay: .3s; 
  margin-left: ${prop("spaceBetween")}px;
`

export const Circle3 = styled(Circle)<{ spaceBetween: number }>`
  animation-delay: .6s; 
  margin-left: ${prop("spaceBetween")}px;
`
