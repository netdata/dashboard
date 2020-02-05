import React from "react";
import { Button, iconsList } from "@netdata/netdata-ui";

import {
  StyledHeader,
  LogoSection,
  LogoContainer,
  NavigationSection,
  UserSection,
  CollapsableSection,
  StyledGear,
  WhiteSpaceSection
} from "./styled";

console.info(iconsList);

/**
 * AppHeader renders the top bar of the application.
 */

export const AppHeader = () => (
  <StyledHeader>
    <CollapsableSection>
      <LogoSection>
        <LogoContainer />
        <Button type="borderless" icon="hamburger" />
      </LogoSection>
      <NavigationSection sectionDisplayed />
      <WhiteSpaceSection />
    </CollapsableSection>
    <UserSection>
      <Button type="borderless" icon="alarm" />
      <StyledGear type="borderless" icon="gear" />
    </UserSection>
  </StyledHeader>
);
