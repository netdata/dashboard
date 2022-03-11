import React from "react"
import { Text } from "@netdata/netdata-ui"
import Item from "../item"
import { useSelector } from "@/src/store/redux-separate-context"

const hostNameSelector = state => {
  const snapshot = state.global.snapshot
  const data = state.global.chartsMetadata.data

  if (!snapshot && !data) return ""
  return snapshot ? snapshot.hostname : data.hostname
}

const Node = () => {
  const hostname = useSelector(hostNameSelector)

  return (
    <Item icon="node_hollow">
      <Text data-testid={`header-nodename-${hostname}`} color="bright" strong truncate>
        {hostname}
      </Text>
    </Item>
  )
}

export default Node
