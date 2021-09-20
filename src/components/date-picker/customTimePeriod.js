import React, { useCallback, useEffect, useState } from "react"
import { isValid, add, getUnixTime } from "date-fns"
import { Flex, Text } from "@netdata/netdata-ui"
import {
  getCustomTimePeriod,
  parseInputPeriod,
  dateResolutions,
  maxTimePeriodInUnix,
} from "./utils"
import { StyledDropdown, DropdownIcon, CustomInput, StyledCustomTimePeriod } from "./styled"

const CustomTimePeriod = ({
  handleTimePeriodChange,
  selectedStart,
  selectedResolution,
  tagging,
}) => {
  const [value, setValue] = useState(0)
  const [isDropdownOpen, toggleDropdown] = useState(false)

  useEffect(
    () =>
      selectedStart <= 0
        ? setValue(getCustomTimePeriod(-selectedStart, selectedResolution))
        : setValue(0),
    [selectedStart]
  )

  const onChange = useCallback(e => setValue(e.target.value), [])

  const onBlur = useCallback(
    e => {
      const inputValue = Number(e.currentTarget.value)
      const isValidInput =
        !Number.isNaN(inputValue) && Number.isInteger(inputValue) && inputValue > 0
      const timePeriod = add(new Date(0), {
        [selectedResolution]: inputValue,
      })
      const isValidTimePeriod =
        isValidInput && isValid(timePeriod) && getUnixTime(timePeriod) <= maxTimePeriodInUnix
      if (isValidTimePeriod)
        return handleTimePeriodChange(
          parseInputPeriod(inputValue, selectedResolution),
          selectedResolution
        )
      return selectedStart <= 0
        ? setValue(getCustomTimePeriod(-selectedStart, selectedResolution))
        : setValue(0)
    },
    [selectedResolution, value]
  )

  const onChangeResolution = useCallback(
    newResolution => {
      return () => {
        handleTimePeriodChange(parseInputPeriod(value, newResolution), newResolution)
        toggleDropdown(false)
      }
    },
    [value]
  )

  const renderTitle = () => (
    <Flex alignItems="center" flexWrap={false} width="100%">
      <Text padding={[0, 4, 0, 0]}>{selectedResolution}</Text>
      <DropdownIcon name="triangle_down" />
    </Flex>
  )
  return (
    <Flex
      justifyContent="start"
      alignItems="center"
      height={8}
      data-ga={`date-picker::click-last-integer::${tagging}`}
      data-testid="customTimePeriod"
    >
      <Text strong>Last</Text>
      <CustomInput
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        data-ga={`date-picker::click-last-integer::${tagging}::${value}`}
        data-testid="timePeriod-timeInput"
      />
      <StyledDropdown
        isOpen={isDropdownOpen}
        onMenuToggle={toggleDropdown}
        renderTitle={renderTitle}
        renderOpener={() => null}
      >
        {() =>
          dateResolutions.map(dateResolution => (
            <StyledCustomTimePeriod
              key={dateResolution}
              onClick={onChangeResolution(dateResolution)}
              data-ga={`date-picker::click-last-time-${dateResolution}::${tagging}`}
              data-testid="timePeriod-option"
            >
              {dateResolution}
            </StyledCustomTimePeriod>
          ))
        }
      </StyledDropdown>
    </Flex>
  )
}

export default CustomTimePeriod
