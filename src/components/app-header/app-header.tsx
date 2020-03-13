import React from "react"

import { useSelector } from "store/redux-separate-context"
import { ChartsMetadata } from "domains/global/types"
import { selectSnapshot, selectActiveAlarms } from "domains/global/selectors"

import { getIframeSrc } from "utils"
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
  StyledHelpIcon,
  StyledGearContainer,
} from "./styled"

interface Props {
  cloudBaseURL: string
  chartsMetadata: ChartsMetadata
}
export const AppHeader = ({
  cloudBaseURL,
  chartsMetadata,
}: Props) => {
  const snapshot = useSelector(selectSnapshot)
  const hostname = snapshot ? snapshot.hostname : chartsMetadata.hostname

  const activeAlarms = useSelector(selectActiveAlarms)
  const alarms = activeAlarms ? Object.values(activeAlarms.alarms) : []
  const criticalAlarmsCount = alarms.filter((alarm) => alarm.status === "CRITICAL").length
  const warningAlarmsCount = alarms.filter((alarm) => alarm.status === "WARNING").length
  return (
    <StyledHeader>
      <CollapsableSection>
        <PanelControl />
        <NavigationSection>
          <NodeInfo
            criticalAlarmsCount={criticalAlarmsCount}
            warningAlarmsCount={warningAlarmsCount}
            hostname={hostname}
          />
        </NavigationSection>
        <WhiteSpaceSection />
      </CollapsableSection>
      <UtilitySection>
        {!snapshot && (
          <VersionControl
            currentVersion={chartsMetadata.version}
            releaseChannel={chartsMetadata.release_channel}
          />
        )}
        <IconContainer>
          <StyledHelpIcon href="#" className="btn" data-toggle="modal" data-target="#helpModal">
            <i className="fas fa-question-circle" />
          </StyledHelpIcon>
        </IconContainer>
        <IconContainer>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a href="#" className="btn" data-toggle="modal" data-target="#loadSnapshotModal">
            <i className="fas fa-download" />
          </a>
        </IconContainer>
        <IconContainer>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a href="#" className="btn" data-toggle="modal" data-target="#saveSnapshotModal">
            <i className="fas fa-upload" />
          </a>
        </IconContainer>
        <IconContainer>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a href="#" className="btn" data-toggle="modal" data-target="#printPreflightModal">
            <i className="fas fa-print" />
          </a>
        </IconContainer>
        <AlarmsControl
          criticalAlarmsCount={criticalAlarmsCount}
          warningAlarmsCount={warningAlarmsCount}
        />
        <IconContainer>
          <StyledGearContainer
            href="#"
            className="btn"
            data-toggle="modal"
            data-target="#optionsModal"
          >
            <StyledGear type="borderless" icon="gear" />
          </StyledGearContainer>
        </IconContainer>
        <IframeContainer>
          <iframe
            title="Sign In"
            src={getIframeSrc(cloudBaseURL, "sign-in")}
            width="100%"
            height="40px"
            style={{ border: "none" }}
          />
        </IframeContainer>
      </UtilitySection>
    </StyledHeader>
  )
}
