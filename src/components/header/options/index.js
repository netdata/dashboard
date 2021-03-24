import React from "react"
import { Flex, Menu, Icon } from "@netdata/netdata-ui"
import Container from "./container"
import Option from "./option"

const Options = () => {
  return (
    <Menu
      icon={<Icon name="node_import_export" color="text" />}
      items={[]}
      renderDropdown={() => (
        <Container>
          <Flex as={Option} padding={[0, 4]} data-toggle="modal" data-target="#loadSnapshotModal">
            Import a shapshot
          </Flex>
          <Flex as={Option} padding={[0, 4]} data-toggle="modal" data-target="#saveSnapshotModal">
            Export a snapshot
          </Flex>
          <Flex
            as={Option}
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
