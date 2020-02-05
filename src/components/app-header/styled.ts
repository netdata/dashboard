import styled from "styled-components";
import { getColor, getSizeBy, Button, breakpoints } from "@netdata/netdata-ui";

const appHeaderZIndex = 5;

export const StyledHeader = styled.header`
  z-index: ${appHeaderZIndex};
  top: 0;
  position: fixed;
  height: 56px;
  width: 100%;
  background: ${getColor(["gray", "limedSpruce"])};
  display: flex;
  flex-flow: row nowrap;

  @media ${breakpoints.laptop} {
    padding-right: ${getSizeBy()};
  }

  @media ${breakpoints.laptopLarge} {
    padding-right: ${getSizeBy(3)};
  }
`;

export const CollapsableSection = styled.section`
  flex-grow: 1;
  flex-shrink: 1;
  display: flex;
  flex-flow: row nowrap;
`;

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
  padding: ${`0 ${getSizeBy(2)}`};

  &::after {
    position: absolute;
    content: "";
    width: 1px;
    height: ${getSizeBy(5)};
    top: ${getSizeBy()};
    right: 1px;
    background: ${getColor(["borderColor"])};
  }
`;

export const LogoContainer = styled.div`
  height: ${getSizeBy(3)};
  width: ${getSizeBy(15)};
`;

export const NavigationSection = styled.section<{ sectionDisplayed: boolean }>`
  position: relative;
  flex-grow: 0;
  flex-shrink: 1;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: 0 ${getSizeBy(3)};
`;

export const WhiteSpaceSection = styled.section`
  flex: 1;
`;

export const UserSection = styled.section`
  padding-left: 4px;
  height: 100%;
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-end;

  @media ${breakpoints.laptop} {
    padding-left: ${getSizeBy()};
  }
  @media ${breakpoints.laptopLarge} {
    padding-left: ${getSizeBy(2)};
  }
`;

export const StyledGear = styled(Button)`
  fill: ${getColor(["white", "pure"])};
`;
