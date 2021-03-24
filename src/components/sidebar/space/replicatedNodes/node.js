import React from "react"
import { Flex, Text, Icon } from "@netdata/netdata-ui"
import Pill from "components/header/pill"

const Node = ({ hostname, url, status }) => {
  return (
    <Flex
      as="a"
      href={url}
      key={hostname}
      padding={[0, 0, 0, 2]}
      gap={2}
      alignItems="center"
      justifyContent="between"
    >
      <Flex alignItems="center" gap={2}>
        <Icon name="node" color="bright" />
        <Text color="bright" truncate>
          {hostname}
        </Text>
      </Flex>
      <Pill background={status ? "success" : "border"} color="bright">
        {status ? "LIVE" : "OFF"}
      </Pill>
    </Flex>
  )
}

export default Node
