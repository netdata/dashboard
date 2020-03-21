import React, { useCallback, useRef, useEffect } from "react"
import { useEffectOnce } from "react-use"

import { useSelector } from "store/redux-separate-context"
import { ChartsMetadata } from "domains/global/types"
import { selectSnapshot, selectActiveAlarms, selectRegistry } from "domains/global/selectors"

import { getIframeSrc } from "utils"
import { isDevelopmentEnv } from "utils/env"
import { useListenToPostMessage } from "utils/post-message"
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
  SignInButton,
} from "./styled"

const iframeTimeout = isDevelopmentEnv ? 3000 : 750
const WAITING_FOR_HELLO_TIME = 500

interface Props {
  cloudBaseURL: string
  chartsMetadata: ChartsMetadata
  isSignedIn: boolean
  enoughWaitingForIframe: boolean
  onEnoughWaitingForIframe: () => void
  setIsOffline: (v: boolean) => void
}
export const AppHeader = ({
  cloudBaseURL,
  chartsMetadata,
  isSignedIn,
  enoughWaitingForIframe,
  onEnoughWaitingForIframe,
  setIsOffline,
}: Props) => {
  const snapshot = useSelector(selectSnapshot)
  const hostname = snapshot ? snapshot.hostname : chartsMetadata.hostname

  const activeAlarms = useSelector(selectActiveAlarms)
  const alarms = activeAlarms ? Object.values(activeAlarms.alarms) : []
  const criticalAlarmsCount = alarms.filter((alarm) => alarm.status === "CRITICAL").length
  const warningAlarmsCount = alarms.filter((alarm) => alarm.status === "WARNING").length

  const registry = useSelector(selectRegistry)
  const name = encodeURIComponent(registry.hostname)
  const origin = encodeURIComponent(`${window.location.origin}/`)
  const signInIframeUrl = getIframeSrc(
    cloudBaseURL,
    `sign-in?id=${registry.machineGuid}&name=${name}&origin=${origin}`,
  )

  const redirectURI = encodeURIComponent(window.location.href)
  // eslint-disable-next-line max-len
  const signInLinkHref = `${cloudBaseURL}/sign-in?id=${registry.machineGuid}&name=${name}&origin=${origin}&redirect_uri=${redirectURI}`

  const [helloFromSignIn] = useListenToPostMessage("hello-from-sign-in")
  const helloFromSignInRef = useRef(helloFromSignIn)
  useEffect(() => {
    helloFromSignInRef.current = helloFromSignIn
  }, [helloFromSignIn])

  const hasIframeRendered = useRef(false)
  const handleIframeLoad = useCallback(() => {
    // this is called either on success and failure!
    hasIframeRendered.current = true
    setTimeout(() => {
      if (helloFromSignInRef.current === undefined) {
        // it means it's definitely offline (probably load error)
        setIsOffline(true)
      }
    }, WAITING_FOR_HELLO_TIME)
  }, [setIsOffline])

  // wait a litte bit before we start showing spinners, rendering offline stuff, etc.
  useEffectOnce(() => {
    const timeoutId = setTimeout(() => {
      onEnoughWaitingForIframe()
    }, iframeTimeout)
    return () => {
      clearTimeout(timeoutId)
    }
  })
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
            src={signInIframeUrl}
            width="100%"
            height="40px"
            style={{
              border: "none",
              display: isSignedIn ? undefined : "none",
            }}
            onLoad={handleIframeLoad}
          />
          {!isSignedIn && enoughWaitingForIframe && (
            <SignInButton
              href={signInLinkHref}
            >
              Sign-in
            </SignInButton>
          )}
        </IframeContainer>
      </UtilitySection>
    </StyledHeader>
  )
}
