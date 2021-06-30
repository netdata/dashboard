import React, { Fragment, useRef, useState, useMemo, useEffect, useCallback } from "react"
import styled from "styled-components"
import { useToggle } from "react-use"
import { useDispatch, useSelector } from "store/redux-separate-context"
import { setUTCOffset } from "@/src/domains/global/actions"
import { selectUTCOffsetSetting } from "domains/global/selectors"
import { Drop, Flex, Text, webkitVisibleScrollbar, TextInput, Icon } from "@netdata/netdata-ui"
import { MenuItem } from "components/menus"

import { timezones } from "./timezones"

const Dropdown = styled(Flex).attrs({
  column: true,
  padding: [2],
  background: "dropdown",
  round: 1,
  overflow: { vertical: "auto" },
  margin: [2, 0, 0],
  width: 50,
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

const Timezone = () => {
  const [value, setValue] = useState("")
  const [isOpen, toggle] = useToggle()
  const ref = useRef()
  const inputRef = useRef()

  const utcOffset = useSelector(selectUTCOffsetSetting)
  const dispatch = useDispatch()

  const close = () => {
    toggle(false)
    setValue("")
  }

  const onChange = useCallback(e => setValue(e.target.value), [])

  useEffect(() => {
    if (!inputRef.current || !isOpen) return
    inputRef.current.focus()
  }, [isOpen])

  const selectedOffset = useMemo(() => {
    return timezones.find(({ offset }) => parseInt(offset) === utcOffset)
  }, [utcOffset])

  const zones = useMemo(() => {
    if (!value) return timezones
    return timezones.filter(
      ({ name, offset }) => name.includes(value.toUpperCase()) || offset.includes(value)
    )
  }, [value])

  return (
    <Fragment>
      <MenuItem round={1} onClick={toggle} ref={ref} Wrapper={WrapperItem}>
        <Flex gap={1}>
          <Text color="text">{selectedOffset?.name} </Text>
          <Text color="textLite">UTC {selectedOffset?.offset}</Text>
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
              {zones.map(({ name, offset }) => (
                <MenuItem
                  key={offset}
                  Wrapper={WrapperItem}
                  round={1}
                  onClick={() => {
                    dispatch(setUTCOffset({ utcOffset: parseInt(offset) }))
                    close()
                  }}
                >
                  <Text color="text">{name}</Text>
                  <Text color="textLite">UTC {offset}</Text>
                </MenuItem>
              ))}
            </Inner>
          </Dropdown>
        </Drop>
      )}
    </Fragment>
  )
}

export default Timezone
