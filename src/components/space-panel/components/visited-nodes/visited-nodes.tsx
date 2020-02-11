import React from "react"
import { CollapsibleList, SimpleListItem } from "@rmwc/list"
import { Text } from "@netdata/netdata-ui"
import "@material/list/dist/mdc.list.css"
import "@rmwc/list/collapsible-list.css"
import "@rmwc/icon/icon.css"
import { NodesContainer, ListItem, StyledIcon, ListHeaderContainer, NodeUrl } from "./styled"
import { agentsMock } from "../../mocks"

const Node = ({ agent: { name, validURLs }, visitNode }: any) => {
  const urls = validURLs ? Object.keys(validURLs) : []
  return (
    <CollapsibleList
      handle={
        <SimpleListItem
          text={
            <>
              <StyledIcon name="node" />
              <Text>{name}</Text>
            </>
          }
          metaIcon={urls.length && "chevron_right"}
        />
      }
    >
      {urls.map((url: string, i: number) => (
        <ListItem
          key={i}
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
        handle={
          <ListHeaderContainer>
            <SimpleListItem metaIcon="chevron_right" text="Visited Nodes" />
          </ListHeaderContainer>
        }
      >
        {agents.map((agent: any, i: any) => (
          <Node key={i} visitNode={visitNode} agent={agent} />
        ))}
      </CollapsibleList>
    </NodesContainer>
  )
}
