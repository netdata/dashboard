import React from "react"
import { CollapsibleList, SimpleListItem } from "@rmwc/list"
import "@material/list/dist/mdc.list.css"
import "@rmwc/list/collapsible-list.css"
import "@rmwc/icon/icon.css"
import { naturalSortCompare } from "domains/dashboard/utils/sorting"
import { MASKED_DATA } from "domains/global/constants"

import {
  NodesContainer,
  ListItem,
  StyledIcon,
  ListHeaderContainer,
  NodeUrl,
  NodeName,
  TrashIcon,
} from "./styled"

// Enforces a maximum string length while retaining the prefix and the postfix of
// the string.
const truncateString = (str: string, maxLength: number) => {
  if (str.length <= maxLength) {
    return str
  }

  const spanLength = Math.floor((maxLength - 3) / 2)
  return `${str.substring(0, spanLength)}...${str.substring(str.length - spanLength)}`
}


interface NodeProps {
  alternateUrls: string[]
  machineGuid: string
  name: string
  url: string
}
const Node = ({
  name, alternateUrls, machineGuid,
}: NodeProps) => (
  <CollapsibleList
    handle={(
      <SimpleListItem
        text={(
          <>
            <StyledIcon name="node" />
            <NodeName
              href=""
              onClick={(event) => {
                event.preventDefault() // prevent navigating to url
                event.stopPropagation()
                window.gotoServerModalHandler(machineGuid)
              }}
            >
              {name}
            </NodeName>
          </>
        )}
        metaIcon={alternateUrls.length && "chevron_right"}
      />
    )}
  >
    {alternateUrls.map((url: string) => (
      <ListItem
        key={url}
      >
        <NodeUrl
          href={url}
        >
          {truncateString(url, 50)}
        </NodeUrl>
        <TrashIcon
          name="trashcan"
          size="small"
          onClick={() => {
            window.deleteRegistryModalHandler(machineGuid, name, url)
          }}
        />
      </ListItem>
    ))}
  </CollapsibleList>
)


interface Props {
  machinesArray: RegistryMachine[]
}

export const VisitedNodes = ({
  machinesArray,
}: Props) => {
  const sortedMachines = machinesArray.sort((a, b) => naturalSortCompare(a.name, b.name))
    .filter(({ url }) => url !== MASKED_DATA)

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
        {sortedMachines.map(({
          name, alternateUrls, guid, url,
        }) => (
          <Node
            alternateUrls={alternateUrls}
            key={`${name}-${guid}`}
            machineGuid={guid}
            name={name}
            url={url}
          />
        ))}
      </CollapsibleList>
    </NodesContainer>
  )
}
