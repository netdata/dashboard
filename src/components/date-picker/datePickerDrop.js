import React, { useState, useEffect, useMemo, useRef, useCallback } from "react"
import { Button, Flex } from "@netdata/netdata-ui"
import useToggle from "hooks/useToggle"
import TimePeriods from "./timePeriods"
import CustomTimePeriod from "./customTimePeriod"
import DatePickerWrapper from "./datePickerWrapper"
import { getFocusTagging } from "./utils"
import PeriodIndication from "./periodIndication"
import { PickerBox, StyledDrop, StyledHR } from "./styled"
import AccessorElement from "./accessorElement"

export const reportEvent = (
  eventCategory,
  eventAction,
  eventLabel,
  eventValue,
  event = "gaCustomEvent"
) => {
  if (window.dataLayer) {
    const eventData = { event, eventCategory, eventAction, eventLabel, eventValue }
    window.dataLayer.push(eventData)
  }
}

const DatePickerDrop = ({
  setRangeValues,
  pickedValues: { start: initialStartDate, end: initialEndDate } = {},
  tagging = "",
  isPlaying,
}) => {
  const [startDate, setStartDate] = useState(initialStartDate)
  const [endDate, setEndDate] = useState(initialStartDate)
  const [focusedInput, setFocusedInput] = useState("startDate")
  const [isOpen, toggle, , close] = useToggle()
  const ref = useRef()

  const setDates = useCallback(({ startDate, endDate }) => {
    setStartDate(startDate)
    setEndDate(endDate)
  }, [])

  useEffect(() => {
    setDates({
      startDate: initialStartDate,
      endDate: initialEndDate,
    })
  }, [initialStartDate, initialEndDate])

  const clearChanges = useCallback(() => setDates({ startDate: -60 * 15, endDate: 0 }), [])

  const onInputFocus = useCallback(e => {
    if (!e.target.name) return
    setFocusedInput(e.target.name)
  }, [])

  const applyChanges = () => {
    console.log({
      start: startDate,
      end: endDate,
    })
    setRangeValues({
      start: startDate,
      end: endDate,
    })
    close()
  }

  const focusTagging = useMemo(() => getFocusTagging(focusedInput), [focusedInput])
  const isValidTimePeriod = useMemo(
    () => startDate !== null && endDate !== null && startDate !== endDate,
    [startDate, endDate]
  )

  const onDatepickerChange = (startDate, endDate) => {
    setDates({ startDate, endDate })
    const date = focusTagging === "finish" ? endDate || startDate : startDate || endDate
    reportEvent("date-picker", "click-date-picker", tagging, String(date))
  }

  const pickerDrop = (
    <StyledDrop
      target={ref.current}
      canHideTarget={false}
      align={{ top: "bottom", left: "left" }}
      onEsc={close}
      onClickOutside={close}
    >
      <PickerBox data-testid="datePicker">
        <Flex justifyContent="between" alignItems="center" width="100%" padding={[6, 6, 0, 6]}>
          <Flex column gap={3} margin={[0, 7, 0, 0]}>
            <TimePeriods handleDatesChange={setDates} selectedDate={startDate} tagging={tagging} />
            <CustomTimePeriod
              handleDatesChange={setDates}
              selectedStart={startDate}
              tagging={tagging}
            />
          </Flex>
          <StyledHR />
          <DatePickerWrapper
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            onDatesChange={onDatepickerChange}
            onInputFocus={onInputFocus}
          />
        </Flex>
        <Flex
          alignItems="center"
          justifyContent={isValidTimePeriod ? "between" : "end"}
          width="100%"
          padding={[5, 6]}
        >
          {isValidTimePeriod && <PeriodIndication startDate={startDate} endDate={endDate} />}
          <Flex alignItems="center" justifyContent="center" gap={4}>
            <Button
              label="CLEAR"
              flavour="hollow"
              onClick={clearChanges}
              data-ga={`date-picker::click-clear::${tagging}-${focusTagging}`}
              data-testid="datePicker-clear"
            />
            <Button
              label="APPLY"
              onClick={applyChanges}
              disabled={!isValidTimePeriod}
              data-ga={`date-picker::click-apply::${tagging}-${focusTagging}`}
              data-testid="datePicker-apply"
            />
          </Flex>
        </Flex>
      </PickerBox>
    </StyledDrop>
  )

  return (
    <>
      <AccessorElement
        onClick={toggle}
        tagging={tagging}
        open={isOpen}
        isPlaying={isPlaying}
        setRangeValues={setRangeValues}
        start={initialStartDate}
        end={initialEndDate}
        ref={ref}
      />
      {ref.current && isOpen && pickerDrop}
    </>
  )
}

export default DatePickerDrop
