import React from "react"
import { Flex, Button } from "@netdata/netdata-ui"
import Tooltip from "@/src/components/tooltips"

const Options = () => {
  return (
    <Flex gap={2}>
      <Tooltip content="Import a Netdata snapshot" align="bottom" plain>
        <Button
          flavour="borderless"
          neutral
          themeType="dark"
          data-toggle="modal"
          data-target="#loadSnapshotModal"
          icon="download"
        />
      </Tooltip>
      <Tooltip content="Export a Netdata snapshot" align="bottom" plain>
        <Button
          flavour="borderless"
          neutral
          themeType="dark"
          data-toggle="modal"
          data-target="#saveSnapshotModal"
          icon="upload"
        />
      </Tooltip>
      <Tooltip content="Print the dashboard" align="bottom" plain>
        <Button
          flavour="borderless"
          neutral
          themeType="dark"
          data-toggle="modal"
          data-target="#printPreflightModal"
          icon="print"
        />
      </Tooltip>
    </Flex>
  )
}

export default Options
