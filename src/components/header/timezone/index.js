import React, { Fragment, useRef, useState, useMemo, useEffect, useCallback } from "react"
import styled from "styled-components"
import { useToggle } from "react-use"
import { useDispatch, useSelector } from "store/redux-separate-context"
import { setOptionAction } from "@/src/domains/global/actions"
import { selectTimezoneSetting } from "domains/global/selectors"
import { Drop, Flex, Text, webkitVisibleScrollbar, TextInput, Icon } from "@netdata/netdata-ui"
import { MenuItem } from "components/menus"

import { timezoneList, getDefaultTimezone } from "./utils"

const timezones = timezoneList().sort((a, b) => a.offset - b.offset)

const Dropdown = styled(Flex).attrs({
  column: true,
  padding: [2],
  background: "dropdown",
  round: 1,
  overflow: { vertical: "auto" },
  margin: [2, 0, 0],
  width: 80,
})`
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`

const Inner = styled(Flex).attrs({
  column: true,
  padding: [2, 0, 0],
  overflow: { vertical: "auto" },
  height: { max: "320px " },
})`
  ${webkitVisibleScrollbar};
`

const WrapperItem = styled(Flex).attrs({
  justifyContent: "between",
  alignItems: "center",
  width: "100%",
  gap: 2,
})``

const Search = styled(TextInput)`
  & input {
    background: transparent;
  }

  & > label {
    margin-bottom: 0;
  }
`

const Item = ({ text, offset, utc, onSelect }) => {
  const onClick = useCallback(() => onSelect(utc), [utc])

  return (
    <MenuItem Wrapper={WrapperItem} round={1} onClick={onClick}>
      <Text color="text" whiteSpace="nowrap">
        {text}
      </Text>
      <Text color="textLite" whiteSpace="nowrap">
        UTC {offset}
      </Text>
    </MenuItem>
  )
}

const Timezone = () => {
  const [value, setValue] = useState("")
  const [isOpen, toggle] = useToggle()
  const ref = useRef()
  const inputRef = useRef()

  const selectedTimezone = useSelector(selectTimezoneSetting)

  const dispatch = useDispatch()

  const close = () => {
    toggle(false)
    setValue("")
  }

  const onChange = useCallback(e => setValue(e.target.value), [])

  const [selectedText, selectedOffset] = useMemo(() => {
    const timezone =
      selectedTimezone === "default" ? getDefaultTimezone().timeZone : selectedTimezone

    const selected = timezones.find(({ utc }) => utc.includes(timezone))

    return [selected?.text, selected?.offset]
  }, [selectedTimezone])

  useEffect(() => {
    if (!inputRef.current || !isOpen) return
    inputRef.current.focus()
  }, [isOpen])

  useEffect(() => {
    dispatch(setOptionAction({ key: "utcOffset", value: parseInt(selectedOffset) }))
  }, [selectedOffset])

  const zones = useMemo(() => {
    if (!value) return timezones
    return timezones.filter(
      ({ text, offset }) =>
        text.toUpperCase().includes(value.toUpperCase()) || offset.includes(value)
    )
  }, [value])

  const onSelect = useCallback(utc => {
    dispatch(setOptionAction({ key: "timezone", value: utc }))
    close()
  }, [])

  return (
    <Fragment>
      <MenuItem round={1} onClick={toggle} ref={ref} Wrapper={WrapperItem}>
        <Flex gap={1}>
          <Text color="text" whiteSpace="nowrap">
            {selectedText}{" "}
          </Text>
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
            <Search
              inputRef={inputRef}
              value={value}
              onChange={onChange}
              metaShrinked
              placeholder="search"
            />
            <Inner>
              {zones.map(({ text, offset, utc }) => (
                <Item key={text} text={text} offset={offset} utc={utc[0]} onSelect={onSelect} />
              ))}
            </Inner>
          </Dropdown>
        </Drop>
      )}
    </Fragment>
  )
}

export default Timezone
