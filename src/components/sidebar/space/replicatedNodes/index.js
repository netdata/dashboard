import React, { useState, useCallback, useMemo } from "react"
import styled from "styled-components"
import { Flex, Text, Icon, TextInput } from "@netdata/netdata-ui"
import { MenuList } from "components/menus"
import Node from "./node"

const Search = styled(TextInput)`
  & > label {
    margin-bottom: 0;
  }
`

export const StyledIcon = styled(Icon)`
  transform: ${({ right }) => (right ? "rotate(270deg)" : "none")};
`

const ReplicatedNodes = ({ parentNode, replicatedNodes }) => {
  const [listOpen, setListOpen] = useState(true)
  const [value, setValue] = useState("")

  const toggleListOpen = useCallback(() => setListOpen(o => !o), [])
  const onChange = useCallback(e => setValue(e.target.value), [])

  const nodes = useMemo(() => {
    if (!value) return replicatedNodes
    return replicatedNodes.filter(({ hostname }) =>
      hostname.toLowerCase().includes(value.toLowerCase())
    )
  }, [replicatedNodes, value])

  return (
    <MenuList
      isOpen={listOpen}
      toggleOpen={toggleListOpen}
      label={
        <Flex alignItems="center" justifyContent="between">
          <Text strong color="border">
            Replicated nodes
          </Text>
          <StyledIcon right={!listOpen} name="chevron_down" size="small" color="text" />
        </Flex>
      }
    >
      <Flex column gap={4} padding={[4, 0, 0]}>
        <Flex gap={2} as="a" href={parentNode.url}>
          <Icon name="nodes" size="small" color="bright" />
          <Text color="bright">{parentNode.hostname}</Text>
        </Flex>
        {nodes.length >= 5 && (
          <Flex padding={[0, 0, 0, 2]}>
            <Search
              value={value}
              onChange={onChange}
              iconLeft={<Icon name="search_s" size="small" color="text" />}
              metaShrinked
            />
          </Flex>
        )}
        <Flex column gap={2}>
          {nodes.map(({ hostname, url, status }) => (
            <Node key={hostname} hostname={hostname} url={url} status={status} />
          ))}
        </Flex>
      </Flex>
    </MenuList>
  )
}

export default ReplicatedNodes
