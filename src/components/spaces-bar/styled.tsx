import React from "react"
import styled from "styled-components"
import { getSizeBy, getColor, Button } from "@netdata/netdata-ui"

const spacesBarZIndex = 4

export const ListContainer = styled.div`
  position: fixed;
  z-index: ${spacesBarZIndex};
  left: 0;
  top: 56px;
  height: calc(100vh - 56px);
  width: ${getSizeBy(7)};
  background: ${getColor(["gray", "limedSpruce"])};
  padding-top: ${getSizeBy(2)};
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const SpacesList = styled.div`
  overflow: auto;
`

export const SeparatedSection = styled.div`
  position: relative;
  width: 100%;
  padding: ${getSizeBy(2)} 0;
  display: flex;
  justify-content: center;
  &::before {
    position: absolute;
    content: "";
    width: ${getSizeBy(3)};
    height: 1px;
    top: 0;
    left: ${getSizeBy(2)};
    background: ${getColor(["borderColor"])};
  }
`

export const SpacePlaceholder = styled.div`
  width: ${getSizeBy(5)};
  height: ${getSizeBy(5)};
  border-radius: ${getSizeBy()};
  border: 2px dotted ${getColor(["white", "pure"])};
  margin-bottom: ${getSizeBy(2)};
`

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const StyledSpaceBarPlus = styled(({ isDisabled, ...rest }: any) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Button {...rest} />
))`
  background: ${({ isDisabled }) => (isDisabled ? "rgba(0, 171, 68, 0.4);" : "#00AB44")};
  pointer-events: ${({ isDisabled }) => (isDisabled ? "none" : "auto")};
`
