import React, { useCallback, useEffect, useState } from "react"
import { Flex, Text } from "@netdata/netdata-ui"
import { getCustomTimePeriod, parseInputPeriod, dateResolutions } from "./utils"
import { StyledDropdown, DropdownIcon, CustomInput, StyledCustomTimePeriod } from "./styled"

const CustomTimePeriod = ({ handleDatesChange, selectedStart, tagging }) => {
  const [{ resolution, value }, setCustomTimePeriod] = useState({ resolution: "minutes", value: 0 })
  const [isDropdownOpen, toggleDropdown] = useState(false)

  useEffect(
    () =>
      selectedStart <= 0
        ? setCustomTimePeriod(getCustomTimePeriod(-selectedStart, resolution))
        : setCustomTimePeriod({ resolution, value: 0 }),
    [selectedStart]
  )

  const handleTimePeriodChange = useCallback(value => {
    handleDatesChange({
      startDate: value,
      endDate: 0,
    })
  }, [])

  const onChange = useCallback(
    e => setCustomTimePeriod({ resolution, value: e.target.value }),
    [resolution]
  )

  const onBlur = useCallback(
    e => {
      const value = Number(e.currentTarget.value)
      const isValidInput = !Number.isNaN(value) && Number.isInteger(value) && value > 0
      if (isValidInput) return handleTimePeriodChange(parseInputPeriod(value, resolution))
      setCustomTimePeriod(getCustomTimePeriod(-selectedStart, resolution))
    },
    [resolution, value]
  )

  const onChangeResolution = useCallback(
    newResolution => {
      return () => {
        handleTimePeriodChange(parseInputPeriod(value, newResolution))
        toggleDropdown(false)
      }
    },
    [value]
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
