import React, { useRef, useState, useEffect, useMemo, useCallback } from "react"
import { useToggle } from "react-use"
import { Drop, Flex, Text, Icon } from "@netdata/netdata-ui"
import { useDispatch, useSelector } from "store/redux-separate-context"
import { setOptionAction } from "@/src/domains/global/actions"
import { selectTimezoneSetting } from "domains/global/selectors"
import { MenuItem } from "@/src/components/menus"
import Item from "../item"
import Dropdown from "./dropdown"
import Search from "./search"
import Container from "./container"
import Wrapper from "./wrapper"
import OffsetItem from "./offsetItem"
import { getDefaultTimezone, timezoneList, timezonesById } from "./utils"
import { getHashParams } from "utils/hash-utils"

const timezones = timezoneList().sort((a, b) => a.offset - b.offset)
const byId = timezonesById(timezones)

const getTimezone = (selectedTimezone, timezoneHash) => {
  const timezone = timezoneHash
    ? timezoneHash
    : selectedTimezone === "default"
    ? getDefaultTimezone().timeZone
    : selectedTimezone

  return byId[timezone in byId ? timezone : getDefaultTimezone().timeZone] || {}
}

const Timezone = () => {
  const [value, setValue] = useState("")
  const [isOpen, toggle] = useToggle()

  const ref = useRef()
  const inputRef = useRef()

  const { updateUtcParam } = window.urlOptions

  useEffect(() => {
    if (!inputRef.current || !isOpen) return
    inputRef.current.focus()
  }, [isOpen])

  const dispatch = useDispatch()
  const selectedTimezone = useSelector(selectTimezoneSetting)

  const selectedOffset = useMemo(() => {
    const { utc: timezoneHash = "" } = getHashParams()
    const { offset = "", utc = "" } = getTimezone(selectedTimezone, timezoneHash)

    if (timezoneHash !== utc) updateUtcParam(utc)
    if (selectedTimezone !== utc) dispatch(setOptionAction({ key: "timezone", value: utc }))

    dispatch(setOptionAction({ key: "utcOffset", value: parseFloat(offset) }))

    return offset
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTimezone])

  const zones = useMemo(() => {
    if (!value) return timezones
    return timezones.filter(
      ({ text, offset }) =>
        text.toUpperCase().includes(value.toUpperCase()) || offset.includes(value)
    )
  }, [value])

  const close = () => {
    toggle(false)
    setValue("")
  }

  const onSelect = useCallback(utc => {
    updateUtcParam(utc)
    dispatch(setOptionAction({ key: "timezone", value: utc }))
    close()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onChange = useCallback(e => setValue(e.target.value), [])

  return (
    <Item hasBorder>
      <MenuItem round={1} onClick={toggle} ref={ref} Wrapper={Wrapper}>
        <Flex gap={1}>
          <Text color="textLite" whiteSpace="nowrap">
            UTC {selectedOffset}
          </Text>
        </Flex>
        <Icon name="chevron_down" color="text" width="12px" height="12px" />
      </MenuItem>
      {ref.current && isOpen && (
        <Drop
          target={ref.current}
          align={{ top: "bottom", left: "left" }}
          onEsc={close}
          onClickOutside={close}
          animation
        >
          <Dropdown>
            <Search value={value} onChange={onChange} ref={inputRef} />
            <Container>
              {zones.map(({ text, offset, utc }) => (
                <OffsetItem
                  key={text}
                  name={text}
                  offset={offset}
                  utc={utc[0]}
                  onSelect={onSelect}
                />
              ))}
            </Container>
          </Dropdown>
        </Drop>
      )}
    </Item>
  )
}

export default Timezone
