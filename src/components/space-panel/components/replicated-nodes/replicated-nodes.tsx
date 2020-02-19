import React from "react"
import { CollapsibleList, SimpleListItem } from "@rmwc/list"
import "@material/list/dist/mdc.list.css"
import "@rmwc/list/collapsible-list.css"
import "@rmwc/icon/icon.css"

import { ChartsMetadata } from "domains/global/types"
import { naturalSortCompare } from "domains/dashboard/utils/sorting"

import {
  NodesContainer,
  ListItem,
  StyledIcon,
  ListHeaderContainer,
  MasterNodeContainer,
  NodeLink,
} from "./styled"


interface Props {
  chartsMetadata: ChartsMetadata
}
export const ReplicatedNodes = ({
  chartsMetadata,
}: Props) => {
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

  return (
    <NodesContainer>
      <CollapsibleList
        startOpen
        handle={(
          <ListHeaderContainer>
            <SimpleListItem metaIcon="chevron_right" text="Replicated Nodes" />
          </ListHeaderContainer>
        )}
      >
        <MasterNodeContainer>
          <StyledIcon size="small" name="nodes" />
          <NodeLink href={masterNodeUrl}>{masterNodeName}</NodeLink>
        </MasterNodeContainer>
        {streamedHosts.map(({ hostname }) => (
          // eslint-disable-next-line react/no-array-index-key
          <ListItem key={hostname}>
            <StyledIcon name="node" />
            <NodeLink href={getUrl(hostname)}>{hostname}</NodeLink>
          </ListItem>
        ))}
      </CollapsibleList>
    </NodesContainer>
  )
}
