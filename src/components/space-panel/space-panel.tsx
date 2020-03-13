import React, { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

import { selectSpacePanelIsActive } from "domains/global/selectors"
import { setSpacePanelStatusAction } from "domains/global/actions"
import { ChartsMetadata } from "domains/global/types"

import { naturalSortCompare } from "domains/dashboard/utils/sorting"
import { SpacePanelIframe } from "components/space-panel/space-panel-iframe"
import { VisitedNodes } from "./components/visited-nodes"
import { ReplicatedNodes } from "./components/replicated-nodes"

import {
  PanelContainer, ScrollContainer, PanelSection,
} from "./styled"

const withPrivateRegistry = false

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
  isSignedIn: boolean
}
export const SpacePanel = ({
  chartsMetadata,
  cloudBaseURL,
  isSignedIn,
}: Props) => {
  const dispatch = useDispatch()
  const panelIsActive = useSelector(selectSpacePanelIsActive)

  useEffect(() => {
    dispatch(setSpacePanelStatusAction({ isActive: true }))
  }, [dispatch])

  const streamedHostsData = getStreamedNodes(chartsMetadata)
  const hasStreamedHosts = streamedHostsData.streamedHosts.length > 1

  return (
    <PanelContainer isActive={panelIsActive}>
      {isSignedIn
        ? <SpacePanelIframe cloudBaseURL={cloudBaseURL} streamedHostsData={streamedHostsData} />
        : (
          <ScrollContainer>
            {hasStreamedHosts && (
              <PanelSection leading>
                <ReplicatedNodes chartsMetadata={chartsMetadata} />
              </PanelSection>
            )}
            {withPrivateRegistry && (
              <PanelSection leading={!hasStreamedHosts}>
                <VisitedNodes />
              </PanelSection>
            )}
          </ScrollContainer>
        )}
    </PanelContainer>
  )
}
