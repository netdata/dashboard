import React, { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

import { SPACE_PANEL_STATE } from "utils/utils"
import {
  selectIsCloudEnabled,
  selectIsUsingGlobalRegistry,
  selectRegistry,
  selectSpacePanelIsActive,
} from "domains/global/selectors"
import { setSpacePanelStatusAction } from "domains/global/actions"
import { ChartsMetadata } from "domains/global/types"

import { naturalSortCompare } from "domains/dashboard/utils/sorting"
import { SpacePanelIframe } from "components/space-panel/space-panel-iframe"
import { VisitedNodes } from "./components/visited-nodes"
import { ReplicatedNodes } from "./components/replicated-nodes"

import * as S from "./styled"
import noNetwork from "./no-network.svg"

const getStreamedNodes = (chartsMetadata: ChartsMetadata) => {
  // decodeURI, because pathname (which is hostname) can contain white-spaces
  // or other characters which are URIencoded when user clicks the link
  // and we need to match it with `chartsMetadata.hostname`
  let base = document.location.origin.toString() + decodeURI(document.location.pathname.toString())
  if (base.endsWith(`/host/${chartsMetadata.hostname}/`)) {
    base = base.substring(0, base.length - (`/host/${chartsMetadata.hostname}/`).toString().length)
  }

  if (base.endsWith("/")) {
    base = base.substring(0, base.length - 1)
  }

  const masterNodeName = chartsMetadata.hosts[0].hostname
  const masterNodeUrl = `${base}/`
  const getUrl = (hostname: string) => `${base}/host/${hostname}/`
  const streamedHosts = chartsMetadata.hosts.slice(1)
    .sort((a, b) => naturalSortCompare(a.hostname, b.hostname))
    .map(({ hostname }) => ({ hostname, url: getUrl(hostname) }))
  return {
    masterNodeName,
    masterNodeUrl,
    streamedHosts,
  }
}


interface Props {
  chartsMetadata: ChartsMetadata
  cloudBaseURL: string
  hasSignInHistory: boolean
  isOffline: boolean
  isSignedIn: boolean
  signInUrl: string
}
export const SpacePanel = ({
  chartsMetadata,
  cloudBaseURL,
  hasSignInHistory,
  isOffline,
  isSignedIn,
  signInUrl,
}: Props) => {
  const dispatch = useDispatch()
  const panelIsActive = useSelector(selectSpacePanelIsActive)

  useEffect(() => {
    const spacePanelStatePersisted = localStorage.getItem(SPACE_PANEL_STATE)
    // control space panel from localStorage only when it's in closed state
    // if we want to persist "opened" state, we need to fix a problem when we see invitation
    // to cloud before sign-in state is propagated from iframes
    // it can be difficult to detect and differentiate from the case where user uses space-panel
    // to use registry and streamed-nodes
    if (spacePanelStatePersisted === "false") {
      dispatch(setSpacePanelStatusAction({ isActive: false }))
    } else {
      dispatch(setSpacePanelStatusAction({ isActive: isSignedIn }))
    }
  }, [dispatch, isSignedIn])

  const streamedHostsData = getStreamedNodes(chartsMetadata)
  const hasStreamedHosts = streamedHostsData.streamedHosts.length > 0

  const registry = useSelector(selectRegistry)
  const isUsingGlobalRegistry = useSelector(selectIsUsingGlobalRegistry)

  const machinesArray = registry?.registryMachinesArray || []

  const isCloudEnabled = useSelector(selectIsCloudEnabled)
  return (
    <S.PanelContainer isActive={panelIsActive} isSignedIn={isSignedIn}>
      {isSignedIn
        ? <SpacePanelIframe cloudBaseURL={cloudBaseURL} streamedHostsData={streamedHostsData} />
        : (
          <>
            <S.ScrollContainer>
              {hasStreamedHosts && (
                <S.PanelSection leading>
                  <ReplicatedNodes
                    streamedHostsData={streamedHostsData}
                  />
                </S.PanelSection>
              )}
              {(machinesArray.length > 0) && (
                <S.PanelSection leading={!hasStreamedHosts}>
                  <VisitedNodes machinesArray={machinesArray} />
                </S.PanelSection>
              )}

            </S.ScrollContainer>
            <S.BottomPanelContainer>
              {isUsingGlobalRegistry && (
                <S.SwitchIdentity
                  onClick={() => {
                    window.switchRegistryModalHandler()
                  }}
                >
                  Switch Identity
                </S.SwitchIdentity>
              )}
              {!isOffline && !hasSignInHistory && isCloudEnabled && (
                <S.BottomPanel>
                  <S.BottomPanelHeader>
                    Discover your monitoring superpowers
                  </S.BottomPanelHeader>
                  <S.BottomPanelText>
                    Do you know that you can manage a lot of nodes with Netdata Cloud?
                  </S.BottomPanelText>
                  <S.SignInButton
                    href={signInUrl}
                  >
                    Sign In to Cloud
                  </S.SignInButton>

                </S.BottomPanel>
              )}
              {isOffline && hasSignInHistory && (
                <S.BottomPanel>
                  {/* eslint-disable-next-line react/no-unescaped-entities */}
                  <S.CantConnect>Can't connect to Netdata Cloud</S.CantConnect>
                  <S.NoNetworkIcon viewBox={noNetwork.viewBox}>
                    <use xlinkHref={`#${noNetwork.id}`} />
                  </S.NoNetworkIcon>
                  <S.OfflineDescription>
                    Maybe you are behind a firewall or you don’t have connection to the internet
                  </S.OfflineDescription>
                </S.BottomPanel>
              )}
            </S.BottomPanelContainer>
          </>
        )}
    </S.PanelContainer>
  )
}
