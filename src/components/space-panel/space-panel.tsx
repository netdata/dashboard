import React, { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

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
  let base = document.location.origin.toString() + document.location.pathname.toString()
  if (base.endsWith(`/host/${chartsMetadata.hostname}/`)) {
    base = base.substring(0, base.length - (`/host/${chartsMetadata.hostname}/`).toString().length)
  }

  if (base.endsWith("/")) {
    base = base.substring(0, base.length - 1)
  }

  const masterNodeName = chartsMetadata.hosts[0].hostname
  const masterNodeUrl = `${base}/`
  const getUrl = (hostname: string) => `${base}/host/${hostname}`
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
}
export const SpacePanel = ({
  chartsMetadata,
  cloudBaseURL,
  hasSignInHistory,
  isOffline,
  isSignedIn,
}: Props) => {
  const dispatch = useDispatch()
  const panelIsActive = useSelector(selectSpacePanelIsActive)

  useEffect(() => {
    dispatch(setSpacePanelStatusAction({ isActive: isSignedIn }))
  }, [dispatch, isSignedIn])

  const streamedHostsData = getStreamedNodes(chartsMetadata)
  const hasStreamedHosts = streamedHostsData.streamedHosts.length > 0

  const registry = useSelector(selectRegistry)
  const isUsingGlobalRegistry = useSelector(selectIsUsingGlobalRegistry)

  const name = encodeURIComponent(registry.hostname)
  const origin = encodeURIComponent(`${window.location.origin}/`)
  // eslint-disable-next-line max-len
  const cloudSignInUrl = `${cloudBaseURL}/sign-in?id=${registry.machineGuid}&name=$${name}&origin=${origin}`

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
                  <ReplicatedNodes chartsMetadata={chartsMetadata} />
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
                    Do you now that you can manage a lot of nodes with Netdata Cloud?
                  </S.BottomPanelText>
                  <S.SignInButton
                    href={cloudSignInUrl}
                  >
                    Sign-in
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
