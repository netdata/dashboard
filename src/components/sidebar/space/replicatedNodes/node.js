import React from "react"
import { Flex, Text, Icon } from "@netdata/netdata-ui"
import Pill from "components/header/pill"
import Anchor from "./anchor"

const Node = ({ hostname, url, status }) => {
  return (
    <Anchor href={url} justifyContent="between" padding={[0, 0, 0, 2]}>
      <Flex alignItems="center" gap={2}>
        <Icon name="node" color="bright" />
        <Text color="bright" truncate>
          {hostname}
        </Text>
      </Flex>
      <Pill background={status ? "success" : "border"} color="bright" round={10}>
        {status ? "Live" : "Off"}
      </Pill>
    </Anchor>
  )
}

export default Node
