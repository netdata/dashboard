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
  NodeName,
} from "./styled"
import { masterNodeMock } from "../../mocks"

export const ReplicatedNodes = () => {
  const masterNode = masterNodeMock

  return (
    <NodesContainer>
      <CollapsibleList
        startOpen
        handle={
          <ListHeaderContainer>
            <SimpleListItem metaIcon="chevron_right" text="Replicated Nodes" />
          </ListHeaderContainer>
        }
      >
        <MasterNodeContainer>
          <StyledIcon size="small" name="nodes" />
          <NodeName>{masterNode.name}</NodeName>
        </MasterNodeContainer>
        {masterNode.nodes.map(({ name }: any, i: any) => (
          <ListItem key={i}>
            <StyledIcon name="node" />
            <NodeName>{name}</NodeName>
          </ListItem>
        ))}
      </CollapsibleList>
    </NodesContainer>
  )
}
