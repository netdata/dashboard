import React from "react"
import { Flex, Button } from "@netdata/netdata-ui"

const Options = () => {
  return (
    <Flex gap={2}>
      <Button
        flavour="borderless"
        neutral
        themeType="dark"
        data-toggle="modal"
        data-target="#loadSnapshotModal"
        icon="download"
        title="Import a snapshot"
      />
      <Button
        flavour="borderless"
        neutral
        themeType="dark"
        data-toggle="modal"
        data-target="#saveSnapshotModal"
        icon="upload"
        title="Export a snapshot"
      />
      <Button
        flavour="borderless"
        neutral
        themeType="dark"
        data-toggle="modal"
        data-target="#printPreflightModal"
        icon="print"
        title="Print dashboard"
      />
    </Flex>
  )
}

export default Options
