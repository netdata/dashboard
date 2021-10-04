import { Flex } from "@netdata/netdata-ui"
import React, { useCallback } from "react"
import { getTime, isBefore, format } from "date-fns"
import { useDateTime } from "@/src/utils/date-time"
import DatePicker from "../datePicker/datePickerLib"
import DatePickerInput from "./datePickerInput"
import useConvertedDates, { convertTimestampToDate } from "./useConvertedDate"
import useLocaleDate from "./useLocaleDate"
import { getDateWithOffset } from "./utils"
import { StyledCalendar } from "../datePicker/styled"

const DatePickerWrapper = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onDatesChange,
  onInputFocus,
}) => {
  const getLocaleDate = useLocaleDate()
  const [convertedStartDate, convertedEndDate] = useConvertedDates(startDate, endDate)
  const { utcOffset } = useDateTime()
  const setValidStartDate = useCallback(
    (startDate, setPreviousValue) =>
      isBefore(convertTimestampToDate(startDate, getLocaleDate), convertedEndDate)
        ? setStartDate(startDate)
        : setPreviousValue(),
    [convertedEndDate, getLocaleDate, setStartDate]
  )

  const setValidEndDate = useCallback(
    (endDate, setPreviousValue) =>
      isBefore(convertedStartDate, convertTimestampToDate(endDate, getLocaleDate))
        ? setEndDate(endDate)
        : setPreviousValue(),
    [convertedStartDate, getLocaleDate, setEndDate]
  )

  const onChange = useCallback(
    dates => {
      const [startDate, endDate] = dates

      const startDateWithOffset = startDate
        ? getDateWithOffset(format(startDate, "MMMM d yyyy, H:mm"), utcOffset)
        : startDate
      const endDateWithOffset = endDate
        ? getDateWithOffset(format(endDate, "MMMM d yyyy, H:mm"), utcOffset)
        : endDate

      const startDateTimestamp = getTime(startDateWithOffset) || null
      const endDateTimestamp = getTime(endDateWithOffset) || null

      onDatesChange(startDateTimestamp, endDateTimestamp)
    },
    [utcOffset, onDatesChange]
  )

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
        minDate={new Date("1/1/2018")}
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
          placeholderText="Select a start date"
        />
        <DatePickerInput
          name="endDate"
          value={convertedEndDate}
          onDatesChange={setValidEndDate}
          onFocus={onInputFocus}
          placeholderText="Select an end date"
        />
      </Flex>
    </Flex>
  )
}

export default DatePickerWrapper
