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
  NodeUrl,
  NodeName,
} from "./styled"
import { agentsMock } from "../../mocks"

const Node = ({ agent: { name, validURLs }, visitNode }: any) => {
  const urls = validURLs ? Object.keys(validURLs) : []
  return (
    <CollapsibleList
      handle={(
        <SimpleListItem
          text={(
            <>
              <StyledIcon name="node" />
              <NodeName>{name}</NodeName>
            </>
          )}
          metaIcon={urls.length && "chevron_right"}
        />
      )}
    >
      {urls.map((url: string) => (
        <ListItem
          key={url}
          onClick={() => {
            visitNode(url)
          }}
        >
          <NodeUrl>{url}</NodeUrl>
        </ListItem>
      ))}
    </CollapsibleList>
  )
}

export const VisitedNodes = () => {
  const agents = agentsMock as any[] // useSelector(selectAgentsSortedList)

  const visitNode = (url: string) => {
    if (url.includes("http://") || url.includes("https://")) {
      window.open(url, "_blank")
    } else {
      window.open(`http://${url}`, "_blank")
    }
  }

  return (
    <NodesContainer>
      <CollapsibleList
        startOpen
        handle={(
          <ListHeaderContainer>
            <SimpleListItem metaIcon="chevron_right" text="Visited Nodes" />
          </ListHeaderContainer>
        )}
      >
        {agents.map((agent: any) => (
          <Node key={agent.name} visitNode={visitNode} agent={agent} />
        ))}
      </CollapsibleList>
    </NodesContainer>
  )
}
