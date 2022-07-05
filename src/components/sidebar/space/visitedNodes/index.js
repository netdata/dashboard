import React, { useCallback, useState } from "react"
import { CollapsibleList, SimpleListItem } from "@rmwc/list"
import "@material/list/dist/mdc.list.css"
import "@rmwc/list/collapsible-list.css"
import "@rmwc/icon/icon.css"
import { Box, Flex, Text } from "@netdata/netdata-ui"

import truncateMiddle from "utils/truncateMiddle"
import { naturalSortCompare } from "domains/dashboard/utils/sorting"
import { MASKED_DATA } from "domains/global/constants"
import { MenuList } from "components/menus"

import { NodesContainer, ListItem, StyledIcon, NodeUrl, NodeName, TrashIcon } from "./styled"

const Node = ({ name, alternateUrls, machineGuid }) => (
  <CollapsibleList
    handle={
      <SimpleListItem
        text={
          <>
            <StyledIcon name="node" />
            <NodeName
              color="bright"
              href=""
              onClick={event => {
                event.preventDefault() // prevent navigating to url
                event.stopPropagation()
                window.gotoServerModalHandler(machineGuid)
              }}
            >
              {name}
            </NodeName>
          </>
        }
        metaIcon={alternateUrls.length && "chevron_right"}
      />
    }
  >
    <Box margin={[2, 0, 0]}>
      {alternateUrls.map(url => (
        <ListItem key={url}>
          <NodeUrl href={url}>{truncateMiddle(url, 50)}</NodeUrl>
          <TrashIcon
            name="trashcan"
            size="small"
            onClick={() => {
              window.deleteRegistryModalHandler(machineGuid, name, url)
            }}
          />
        </ListItem>
      ))}
    </Box>
  </CollapsibleList>
)

export const VisitedNodes = ({ machinesArray }) => {
  const sortedMachines = machinesArray
    .sort((a, b) => naturalSortCompare(a.name, b.name))
    .filter(({ url }) => url !== MASKED_DATA)

  const [listOpen, setListOpen] = useState(true)
  const toggleListOpen = useCallback(() => setListOpen(o => !o), [])

  return (
    <MenuList
      isOpen={listOpen}
      toggleOpen={toggleListOpen}
      label={
        <Flex alignItems="center" justifyContent="between">
          <Text strong color="border">
            Visited Nodes
          </Text>
          <StyledIcon right={!listOpen} name="chevron_down" size="small" color="text" />
        </Flex>
      }
    >
      <NodesContainer column gap={2}>
        {sortedMachines.map(({ name, alternateUrls, guid, url }) => (
          <Node
            alternateUrls={alternateUrls}
            key={`${name}-${guid}`}
            machineGuid={guid}
            name={name}
            url={url}
          />
        ))}
      </NodesContainer>
    </MenuList>
  )
}

export default VisitedNodes
