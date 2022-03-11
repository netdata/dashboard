import React, { useCallback } from "react"
import { Flex, Button } from "@netdata/netdata-ui"
import Tooltip from "@/src/components/tooltips"
import { setGlobalPauseAction } from "domains/global/actions"
import { useDispatch } from "store/redux-separate-context"

const Options = () => {
  const dispatch = useDispatch()
  const onClick = useCallback(() => dispatch(setGlobalPauseAction()), [dispatch])
  return (
    <Flex gap={2} data-testid="header-options-button">
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
          onClick={onClick}
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
