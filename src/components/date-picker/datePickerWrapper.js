import { Flex } from "@netdata/netdata-ui"
import React, { useCallback } from "react"
import { toDate, getTime, isBefore } from "date-fns"
import DatePicker from "../datePicker/datePickerLib"
import DatePickerInput from "./datePickerInput"
import { StyledCalendar } from "../datePicker/styled"
import useConvertedDates, { convertTimestampToDate } from "./useConvertedDate"

const DatePickerWrapper = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onDatesChange,
  onInputFocus,
}) => {
  const [convertedStartDate, convertedEndDate] = useConvertedDates(startDate, endDate)
  const setValidStartDate = useCallback(
    (startDate, setPreviousValue) =>
      isBefore(convertTimestampToDate(startDate), convertedEndDate)
        ? setStartDate(startDate)
        : setPreviousValue(),
    [endDate]
  )

  const setValidEndDate = useCallback(
    (endDate, setPreviousValue) =>
      isBefore(convertedStartDate, convertTimestampToDate(endDate))
        ? setEndDate(endDate)
        : setPreviousValue(),
    [startDate]
  )

  const onChange = useCallback(dates => {
    const [startDate, endDate] = dates
    const startDateTimestamp = getTime(toDate(startDate)) || null
    const endDateTimestamp = getTime(toDate(endDate)) || null
    onDatesChange(startDateTimestamp, endDateTimestamp)
  }, [])
  return (
    <Flex
      column
      justifyContent="center"
      alignItems="center"
      flex={{ grow: 1 }}
      gap={3}
      margin={[0, 0, 0, 7]}
      data-testid="datePicker-wrapper"
    >
      <DatePicker
        selected={convertedStartDate}
        onChange={onChange}
        startDate={convertedStartDate}
        endDate={convertedEndDate}
        maxDate={new Date()}
        inline
        selectsRange
        monthsShown={2}
        dateFormat="MMMM d yyyy, H:mm"
        showPopperArrow={false}
        calendarContainer={StyledCalendar}
      />
      <Flex justifyContent="around" alignItems="center" width="100%">
        <DatePickerInput
          name="startDate"
          value={convertedStartDate}
          onDatesChange={setValidStartDate}
          onFocus={onInputFocus}
          placeholderText="Select from date"
        />
        <DatePickerInput
          name="endDate"
          value={convertedEndDate}
          onDatesChange={setValidEndDate}
          onFocus={onInputFocus}
          placeholderText="Select to date"
        />
      </Flex>
    </Flex>
  )
}

export default DatePickerWrapper
