import React, { useCallback } from "react"
import { Text } from "@netdata/netdata-ui"
import { MenuItem } from "@/src/components/menus"
import Wrapper from "./wrapper"

const OffsetItem = ({ name, offset, utc, onSelect }) => {
  const onClick = useCallback(() => onSelect(utc), [utc, onSelect])

  return (
    <MenuItem round={1} onClick={onClick} Wrapper={Wrapper}>
      <Text color="text">{name}</Text>
      <Text color="textLite" whiteSpace="nowrap">
        UTC {offset}
      </Text>
    </MenuItem>
  )
}

export default OffsetItem
