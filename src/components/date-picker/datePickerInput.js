import React, { useState, useEffect, useCallback } from "react"
import { format, isValid, getTime } from "date-fns"
import { getDateWithOffset } from "./utils"
import { StyledDateInput } from "../datePicker/styled"
import { useDateTime } from "@/src/utils/date-time"

const DatePickerInput = ({
  name = "",
  value = "",
  onDatesChange,
  onFocus,
  placeholderText = "",
}) => {
  const { utcOffset } = useDateTime()
  const [inputValue, setInputValue] = useState("")
  const onChange = useCallback(e => {
    const date = e.target.value
    setInputValue(date)
  }, [])
  const setFormattedValue = useCallback(value => {
    if (isValid(value)) {
      const formattedDate = format(value, "MMMM d yyyy, H:mm")
      setInputValue(formattedDate)
    }
  }, [])
  const onBlur = useCallback(
    e => {
      const parsedDate = getDateWithOffset(e.target.value, utcOffset)
      const isValidDate = isValid(parsedDate) && getTime(parsedDate) > 0
      if (isValidDate) {
        const timestamp = getTime(parsedDate)
        onDatesChange(timestamp, () => setFormattedValue(value))
      } else setFormattedValue(value)
    },
    [value, utcOffset, onDatesChange, setFormattedValue]
  )

  useEffect(() => setFormattedValue(value), [value, setFormattedValue])

  return (
    <StyledDateInput
      type="text"
      name={name}
      value={value ? inputValue : placeholderText}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
      placeholder={placeholderText}
      data-testid="datePicker-input"
    />
  )
}

export default DatePickerInput
