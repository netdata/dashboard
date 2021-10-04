import React from "react"
import DatePickerLib from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

const DatePicker = ({
  selected,
  selectsStart = false,
  selectsEnd = false,
  startDate,
  endDate,
  onChange,
  minDate,
  maxDate,
  dateFormat = "MM/dd/yyyy",
  open = false,
  startOpen = false,
  inline = false,
  selectsRange = false,
  monthsShown = 1,
  showPopperArrow = true,
  calendarContainer = null,
}) => (
  <DatePickerLib
    selected={selected}
    onChange={onChange}
    selectsStart={selectsStart}
    selectsEnd={selectsEnd}
    startDate={startDate}
    endDate={endDate}
    minDate={minDate}
    maxDate={maxDate}
    dateFormat={dateFormat}
    open={open}
    startOpen={startOpen}
    inline={inline}
    selectsRange={selectsRange}
    monthsShown={monthsShown}
    showPopperArrow={showPopperArrow}
    calendarContainer={calendarContainer}
  />
)

export default DatePicker
