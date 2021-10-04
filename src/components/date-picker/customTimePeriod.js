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

const CustomTimePeriod = ({ handleTimePeriodChange, value, resolution, tagging }) => {
  const getInputValue = () => (value <= 0 ? getCustomTimePeriod(-value, resolution) : 0)
  const [inputValue, setInputValue] = useState(getInputValue)
  const [isDropdownOpen, toggleDropdown] = useState(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setInputValue(getInputValue()), [value])

  const onChange = useCallback(e => setInputValue(e.target.value), [])

  const onBlur = useCallback(
    e => {
      const currentValue = Number(e.currentTarget.value)
      const isValidInput =
        !Number.isNaN(currentValue) && Number.isInteger(currentValue) && currentValue > 0
      const timePeriod = add(new Date(0), {
        [resolution]: currentValue,
      })
      const isValidTimePeriod =
        isValidInput && isValid(timePeriod) && getUnixTime(timePeriod) <= maxTimePeriodInUnix
      if (isValidTimePeriod)
        return handleTimePeriodChange(parseInputPeriod(currentValue, resolution), resolution)
      return value <= 0 ? setInputValue(getCustomTimePeriod(-value, resolution)) : setInputValue(0)
    },
    [resolution, value, handleTimePeriodChange]
  )

  const onChangeResolution = useCallback(
    newResolution => {
      return () => {
        handleTimePeriodChange(parseInputPeriod(inputValue, newResolution), newResolution)
        toggleDropdown(false)
      }
    },
    [inputValue, handleTimePeriodChange]
  )

  const renderTitle = () => (
    <Flex alignItems="center" flexWrap={false} width="100%">
      <Text padding={[0, 4, 0, 0]}>{resolution}</Text>
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
      <Text>Last</Text>
      <CustomInput
        value={inputValue}
        onChange={onChange}
        onBlur={onBlur}
        data-ga={`date-picker::click-last-integer::${tagging}::${inputValue}`}
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
