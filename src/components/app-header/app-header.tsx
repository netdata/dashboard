import React from "react"

import { PanelControl } from "./components/panel-control"
import { NodeInfo } from "./components/node-info"
import { AlarmsControl } from "./components/alarms-control"
import {
  StyledHeader,
  NavigationSection,
  UtilitySection,
  CollapsableSection,
  StyledGear,
  WhiteSpaceSection,
  IconContainer,
} from "./styled"

/**
 * AppHeader renders the top bar of the application.
 */

export const AppHeader = () => (
  <StyledHeader>
    <CollapsableSection>
      <PanelControl />
      <NavigationSection>
        <NodeInfo />
      </NavigationSection>
      <WhiteSpaceSection />
    </CollapsableSection>
    <UtilitySection>
      <AlarmsControl />
      <IconContainer>
        <StyledGear type="borderless" icon="gear" />
      </IconContainer>
    </UtilitySection>
  </StyledHeader>
)
