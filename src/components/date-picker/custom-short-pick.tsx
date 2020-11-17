import React, { useState, ChangeEvent } from "react"
import moment from "moment"
import { guessResolutionAndValue } from "./utils"
import {
  StyledDropdown,
  TextBox,
  DropdownIcon,
  TypeViewBox,
  DropdownBox,
  LastText,
  CustomInput,
  ShortPickElement,
} from "./styled"
import { DateResolution, PickedValues } from "./types"

type ShortPickerPropsT = {
  setRangeValues: (params: PickedValues) => void
  handleDatesChange: any
  selectedStart: number
  tagging: string
}

const dateResolutions: DateResolution[] = ["minute", "hour", "day", "month"]

const pluralize = (resolution: DateResolution, value: number) => (value === 1
  ? resolution : `${resolution}s`
)

const getNewStart = (timeCorrection: number, resolution: DateResolution) => (
  -moment.duration(timeCorrection, resolution).as("seconds")
)

export function CustomShortPicker(props: ShortPickerPropsT) {
  const {
    setRangeValues, handleDatesChange, selectedStart, tagging,
  } = props
  const { resolution, value: timeCorrection } = selectedStart <= 0
    ? guessResolutionAndValue(-selectedStart)
    : { resolution: "hour" as DateResolution, value: 0 }
  const [isDropdownOpen, toggleDropdown] = useState(false)

  const handleStartChange = (newStart: number) => {
    handleDatesChange({
      startDate: newStart,
      endDate: 0,
    })
    setRangeValues({
      start: newStart,
      end: 0,
    })
  }

  const applyChanges = (newResolution: DateResolution) => () => {
    handleStartChange(getNewStart(timeCorrection, newResolution))
    toggleDropdown(false)
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const newTimeCorrection = Number(e.currentTarget.value)
    if (!Number.isNaN(newTimeCorrection)) {
      handleStartChange(getNewStart(newTimeCorrection, resolution))
    }
  }

  const renderTitle = () => (
    <TypeViewBox>
      <TextBox>{pluralize(resolution, Number(timeCorrection))}</TextBox>
      <DropdownIcon name="triangle_down" />
    </TypeViewBox>
  )

  return (
    <DropdownBox data-testid={`date-picker::click-last-integer::${tagging}`}>
      <LastText>Last</LastText>
      <CustomInput
        value={timeCorrection}
        onChange={handleChange}
        data-testid={`date-picker::click-last-integer::${tagging}::${timeCorrection}`}
      />
      <StyledDropdown
        isOpen={isDropdownOpen}
        onMenuToggle={toggleDropdown}
        renderTitle={renderTitle}
        renderOpener={() => null}
      >
        {dateResolutions.map((dateResolution) => (
          <ShortPickElement
            key={dateResolution}
            onClick={applyChanges(dateResolution)}
            data-testid={`date-picker::click-last-time-${dateResolution}::${tagging}`}
          >
            {pluralize(dateResolution, Number(timeCorrection))}
          </ShortPickElement>
        ))}
      </StyledDropdown>
    </DropdownBox>
  )
}
