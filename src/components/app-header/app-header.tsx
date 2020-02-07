import React from "react"
import { PanelControl } from "./components/panel-control"
import { NodeInfo } from "./components/node-info"
import { AlarmsControl } from "./components/alarms-control"
import { VersionControl } from "./components/version-control"
import {
  StyledHeader,
  NavigationSection,
  UtilitySection,
  CollapsableSection,
  StyledGear,
  WhiteSpaceSection,
  IconContainer,
  IframeContainer,
} from "./styled"

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
      <VersionControl />

      <IconContainer>
        <a href="#" className="btn" data-toggle="modal" data-target="#loadSnapshotModal">
          <i className="fas fa-download" />
        </a>
      </IconContainer>
      <IconContainer>
        <a href="#" className="btn" data-toggle="modal" data-target="#saveSnapshotModal">
          <i className="fas fa-upload" />
        </a>
      </IconContainer>
      <IconContainer>
        <a href="#" className="btn" data-toggle="modal" data-target="#printPreflightModal">
          <i className="fas fa-print" />
        </a>
      </IconContainer>
      <AlarmsControl />
      <IconContainer>
        <StyledGear type="borderless" icon="gear" />
      </IconContainer>
      <IframeContainer />
    </UtilitySection>
  </StyledHeader>
)
