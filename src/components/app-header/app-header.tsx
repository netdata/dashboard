import React, { useCallback, useRef, useEffect } from "react"
import { useEffectOnce } from "react-use"

import { useDispatch, useSelector } from "store/redux-separate-context"
import { ChartsMetadata } from "domains/global/types"
import {
  selectSnapshot,
  selectActiveAlarms,
  selectRegistry,
  selectIsCloudEnabled,
} from "domains/global/selectors"

import { getIframeSrc, NETDATA_REGISTRY_SERVER } from "utils"
import { isDevelopmentEnv } from "utils/env"
import { sendToChildIframe, useListenToPostMessage } from "utils/post-message"
import { SvgIcon } from "components/svg-icon"
import { showSignInModalAction } from "domains/dashboard/actions"
import { LOCAL_STORAGE_NEEDS_SYNC } from "domains/dashboard/sagas"
import { alwaysEndWithSlash } from "utils/server-detection"
import { CLOUD_BASE_URL_DISABLED } from "domains/global/constants"

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
  OfflineBlock,
  SignInIframe,
} from "./styled"
import offlineBlock from "./offline-block.svg"

const iframeTimeout = isDevelopmentEnv ? 3000 : 750
const WAITING_FOR_HELLO_TIME = 500

type HelloFromSignInPayload = {
  dropdownHeight: string
  dropdownWidth: string
  hasActiveCookie: boolean
}

interface Props {
  cloudBaseURL: string
  chartsMetadata: ChartsMetadata
  isOffline: boolean
  isSignedIn: boolean
  enoughWaitingForIframe: boolean
  hasSignInHistory: boolean
  onEnoughWaitingForIframe: () => void
  setIsOffline: (v: boolean) => void
}
export const AppHeader = ({
  cloudBaseURL,
  chartsMetadata,
  isOffline,
  isSignedIn,
  enoughWaitingForIframe,
  hasSignInHistory,
  onEnoughWaitingForIframe,
  setIsOffline,
}: Props) => {
  const snapshot = useSelector(selectSnapshot)
  const hostname = snapshot ? snapshot.hostname : chartsMetadata.hostname

  const isCloudEnabled = useSelector(selectIsCloudEnabled)

  const activeAlarms = useSelector(selectActiveAlarms)
  const alarms = activeAlarms ? Object.values(activeAlarms.alarms) : []
  const criticalAlarmsCount = alarms.filter((alarm) => alarm.status === "CRITICAL").length
  const warningAlarmsCount = alarms.filter((alarm) => alarm.status === "WARNING").length

  const registry = useSelector(selectRegistry)
  const name = encodeURIComponent(registry.hostname)
  const origin = encodeURIComponent(
    alwaysEndWithSlash(window.location.origin + window.location.pathname),
  )
  const iframeUrlSuffix = `${isCloudEnabled ? "" : "&disableCloud=true"}&logoutDropdown=true`
  const signInIframeUrl = getIframeSrc(
    cloudBaseURL,
    `sign-in?id=${registry.machineGuid}&name=${name}&origin=${origin}${iframeUrlSuffix}`,
  )

  const redirectURI = encodeURIComponent(window.location.href)
  // eslint-disable-next-line max-len
  const signInLinkHref = `${cloudBaseURL}/sign-in?id=${registry.machineGuid}&name=${name}&origin=${origin}&redirect_uri=${redirectURI}`

  const [helloFromSignIn] = useListenToPostMessage<HelloFromSignInPayload>("hello-from-sign-in")
  const helloFromSignInRef = useRef(helloFromSignIn)
  useEffect(() => {
    helloFromSignInRef.current = helloFromSignIn
  }, [helloFromSignIn])
  const dropdownHeight = helloFromSignIn?.dropdownHeight
  const dropdownWidth = helloFromSignIn?.dropdownWidth

  const [isLogoutDropdownOpened] = useListenToPostMessage<boolean>("set-is-logout-dropdown-opened")

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


  useEffectOnce(() => {
    // alternative way to catch iframe load (error or success) - firefox doesn't work with onLoad
    // attribute when src is unreachable. In Chrome DOMFrameContentLoaded doesn't fire, but it's ok
    // because it's handled by onLoad
    const handler = (event: Event) => {
      if (!event?.target) {
        return
      }
      const iframeSrc = (event.target as HTMLIFrameElement).src
      if (iframeSrc === signInIframeUrl) {
        if (hasIframeRendered.current === false) {
          handleIframeLoad()
        }
      }
    }
    window.addEventListener("DOMFrameContentLoaded", handler)
    return () => {
      window.removeEventListener("DOMFrameContentLoaded", handler)
    }
  })


  // wait a litte bit before we start showing spinners, rendering offline stuff, etc.
  useEffectOnce(() => {
    const timeoutId = setTimeout(() => {
      onEnoughWaitingForIframe()
    }, iframeTimeout)
    return () => {
      clearTimeout(timeoutId)
    }
  })

  const isUsingGlobalRegistry = registry.registryServer === NETDATA_REGISTRY_SERVER
  const dispatch = useDispatch()
  const handleSignInClick = (event: React.MouseEvent) => {
    if (isUsingGlobalRegistry) {
      // just a link
      return
    }

    event.preventDefault()
    dispatch(showSignInModalAction({
      signInLinkHref,
    }))
  }
  const signInIframeRef = useRef<HTMLIFrameElement>(null)
  useEffect(() => {
    if (isSignedIn && !isUsingGlobalRegistry) {
      const needsSync = localStorage.getItem(LOCAL_STORAGE_NEEDS_SYNC) === "true"
      // that means we were signed in and going back to agent after that
      if (needsSync && signInIframeRef.current) {
        localStorage.removeItem(LOCAL_STORAGE_NEEDS_SYNC)
        const { registryMachinesArray } = registry
        if (registryMachinesArray && registryMachinesArray.length > 0) {
          sendToChildIframe(signInIframeRef.current, {
            type: "synced-private-registry",
            payload: registryMachinesArray,
          })
        }
      }
    }
  }, [isSignedIn, isUsingGlobalRegistry, registry])

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
          {cloudBaseURL !== CLOUD_BASE_URL_DISABLED && (
            <SignInIframe
              ref={signInIframeRef}
              title="Sign In"
              src={signInIframeUrl}
              width={isLogoutDropdownOpened ? dropdownWidth : "100%"}
              height={isLogoutDropdownOpened ? dropdownHeight : "40px"}
              isShown={isSignedIn}
              onLoad={handleIframeLoad}
            />
          )}
          {enoughWaitingForIframe && hasSignInHistory && isOffline && (
            <OfflineBlock>
              <SvgIcon icon={offlineBlock} height={40} />
            </OfflineBlock>
          )}
          {enoughWaitingForIframe && !hasSignInHistory && !isSignedIn && isCloudEnabled && (
            <SignInButton
              href={isUsingGlobalRegistry ? signInLinkHref : ""}
              isDisabled={isOffline}
              onClick={handleSignInClick}
            >
              Sign-in
            </SignInButton>
          )}
        </IframeContainer>
      </UtilitySection>
    </StyledHeader>
  )
}
