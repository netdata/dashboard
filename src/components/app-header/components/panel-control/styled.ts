import styled from "styled-components"
import { getSizeBy, getColor, breakpoints } from "@netdata/netdata-ui"

export const LogoSection = styled.section`
  position: relative;
  height: 100%;
  width: ${getSizeBy(35)};
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  padding: 0 ${getSizeBy(2)};

  @media ${breakpoints.mobileSmall} {
    width: 56px;
    padding: 0 ${getSizeBy()};
  }

  @media ${breakpoints.desktop} {
    width: ${getSizeBy(35)};
  }

  &::after {
    position: absolute;
    content: "";
    width: 1px;
    height: ${getSizeBy(5)};
    top: ${getSizeBy()};
    right: 1px;
    background: ${getColor(["borderColor"])};
  }
`

export const LogoContainer = styled.div`
  height: ${getSizeBy(3)};
  width: ${getSizeBy(15)};
`
