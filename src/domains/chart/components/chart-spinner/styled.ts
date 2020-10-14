import { prop } from "ramda"
import styled, { keyframes } from "styled-components"
import { getColor } from "@netdata/netdata-ui"
import { appHeaderZIndex } from "styles/z-index"

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

export const SpinnerContainer = styled.div<{ top: number; right: number, warningLoader: boolean }>`
  position: absolute;
  top: ${prop("top")}px;
  right: ${prop("right")}px;
  opacity: 0.2;
  width: 20px;
  height: 20px;
  border-style: solid;
  border-width: 0 20px 20px 0;
  border-color: transparent
                ${({ warningLoader }) => getColor(warningLoader ? "warning" : "primary")};
                transparent
                transparent;
  z-index: ${appHeaderZIndex};

  .loader-icon {
    position: absolute;
    top: 2px;
    right: -19px;
    width: 10px;
  }
`

export const Circle = styled.div<{ size: number }>`
  width: ${prop("size")}px;
  height: ${prop("size")}px;
  background: ${getColor("border")};
  border-radius: 50%;
  animation: 1s linear infinite both ${circleAnimation};
`

export const Circle2 = styled(Circle)<{ spaceBetween: number }>`
  animation-delay: 0.3s;
  margin-left: ${prop("spaceBetween")}px;
`

export const Circle3 = styled(Circle)<{ spaceBetween: number }>`
  animation-delay: 0.6s;
  margin-left: ${prop("spaceBetween")}px;
`
