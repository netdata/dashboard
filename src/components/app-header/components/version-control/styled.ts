import styled from "styled-components"
import {
  getColor, Text, breakpoints,
} from "@netdata/netdata-ui"

export const Container = styled.div`
  height: 100%;
  flex-shrink: 0;
  flex-grow: 0;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;

  @media ${breakpoints.mobileSmall} {
    display: none;
  }

  @media ${breakpoints.laptop} {
    display: flex;
  }
`

export const TextBold = styled(Text)`
  margin-left: 6px;
  font-weight: bold;
  color: ${getColor("primary")};
  @media ${breakpoints.mobileSmall} {
    display: none;
  }

  @media ${breakpoints.laptopLarge} {
    display: block;
  }
`

export const NewVersionIndicator = styled.div`
  flex-shrink: 0;
  flex-grow: 0;
  position: relative;
  margin-right: -26px; // make up unnecessary fixed button width
  .button-icon {
    fill: ${getColor("accent")};
  }
  &:hover {
    color: ${getColor("bright")};

    ${TextBold} {
      color: ${getColor("bright")};
    }
  }
`

export const CollapsableText = styled(Text)`
  @media ${breakpoints.mobileSmall} {
    display: none;
  }

  @media ${breakpoints.desktop} {
    display: block;
  }
`
