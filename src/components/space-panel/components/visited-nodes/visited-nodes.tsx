import React from "react"
import { CollapsibleList, SimpleListItem } from "@rmwc/list"
import { Text } from "@netdata/netdata-ui"
import "@material/list/dist/mdc.list.css"
import "@rmwc/list/collapsible-list.css"
import "@rmwc/icon/icon.css"
import { NodesContainer, ListItem, StyledIcon, ListHeaderContainer } from "./styled"
import { agentsMock } from "../../mocks"

export const VisitedNodes = () => {
  const agents = agentsMock as any[] // useSelector(selectAgentsSortedList)

  const visitNode = (index: number) => {
    // const checkedUrls = agents[index].validURLs || {}
    // tryRedirect(Object.keys(checkedUrls), "", true)
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
          <ListItem key={i} onClick={() => visitNode(i)}>
            <StyledIcon name="node" />
            <Text>{agent.name}</Text>
          </ListItem>
        ))}
      </CollapsibleList>
    </NodesContainer>
  )
}
