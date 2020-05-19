import React from "react"
import { CollapsibleList, SimpleListItem } from "@rmwc/list"
import "@material/list/dist/mdc.list.css"
import "@rmwc/list/collapsible-list.css"
import "@rmwc/icon/icon.css"

import {
  NodesContainer,
  ListItem,
  StyledIcon,
  ListHeaderContainer,
  MasterNodeContainer,
  NodeLink,
} from "./styled"


interface Props {
  streamedHostsData: {
    masterNodeName: string
    masterNodeUrl: string
    streamedHosts: { hostname: string; url: string }[]
  }
}
export const ReplicatedNodes = ({
  streamedHostsData: { masterNodeName, masterNodeUrl, streamedHosts },
}: Props) => (
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
      {streamedHosts.map(({ hostname, url }) => (
        // eslint-disable-next-line react/no-array-index-key
        <ListItem key={hostname}>
          <StyledIcon name="node" />
          <NodeLink href={url}>{hostname}</NodeLink>
        </ListItem>
      ))}
    </CollapsibleList>
  </NodesContainer>
)
