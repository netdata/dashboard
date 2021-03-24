import React from "react"
import styled from "styled-components"
import { Flex, Menu, Icon, Text } from "@netdata/netdata-ui"

const Container = styled(Flex).attrs({
  as: "ul",
  position: "relative",
  background: "mainBackground",
  column: true,
  padding: [6, 0],
  margin: [2, 0, 0],
  border: { side: "all", color: "disabled" },
  round: 2,
  gap: 4,
  elevation: 25,
})`
  box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14),
    0 3px 14px 2px rgba(0, 0, 0, 0.12);
  list-style-type: none;
`

const Options = () => {
  return (
    <Menu
      icon={<Icon name="node_import_export" color="text" />}
      items={[]}
      renderDropdown={() => (
        <Container>
          <Flex as={Text} padding={[0, 4]} data-toggle="modal" data-target="#loadSnapshotModal">
            Import
          </Flex>
          <Flex as={Text} padding={[0, 4]} data-toggle="modal" data-target="#saveSnapshotModal">
            Export
          </Flex>
          <Flex
            as={Text}
            padding={[2, 4, 0, 4]}
            border={{ side: "top", color: "disabled" }}
            data-toggle="modal"
            data-target="#printPreflightModal"
          >
            Print
          </Flex>
        </Container>
      )}
      caret={false}
      padding={[0]}
    />
  )
}

export default Options
