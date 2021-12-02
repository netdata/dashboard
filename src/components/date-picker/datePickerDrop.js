import React, { useState, useEffect, useMemo, useRef, useCallback } from "react"
import { Button, Flex } from "@netdata/netdata-ui"
import useToggle from "hooks/useToggle"
import useLocalStorage from "hooks/useLocalStorage"
import TimePeriods from "./timePeriods"
import CustomTimePeriod from "./customTimePeriod"
import DatePickerWrapper from "./datePickerWrapper"
import { getFocusTagging } from "./utils"
import PeriodIndication from "./periodIndication"
import AccessorElement from "./accessorElement"
import { PickerBox, StyledDrop, StyledHR } from "./styled"

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
  onChange,
  values: { start: initialStartDate, end: initialEndDate } = {},
  defaultValue = -60 * 15,
  tagging = "",
  isPlaying,
}) => {
  const [startDate, setStartDate] = useState(initialStartDate)
  const [endDate, setEndDate] = useState(initialStartDate)
  const [resolution, setResolution] = useLocalStorage("resolution", "minutes")
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
  }, [initialStartDate, initialEndDate, setDates])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const clearChanges = useCallback(() => setDates({ startDate: defaultValue, endDate: 0 }), [])

  const onInputFocus = useCallback(e => {
    if (!e.target.name) return
    setFocusedInput(e.target.name)
  }, [])

  const togglePicker = useCallback(
    e => {
      e.stopPropagation()
      toggle()
    },
    [toggle]
  )

  const applyChanges = () => {
    onChange({
      start: startDate,
      end: endDate,
    })
    close()
  }

  const focusTagging = useMemo(() => getFocusTagging(focusedInput), [focusedInput])

  const isValidTimePeriod = startDate !== null && endDate !== null && startDate !== endDate
  const isApplyDisabled = startDate === initialStartDate && endDate === initialEndDate
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const consistentDefaultValue = useMemo(() => defaultValue, [])
  const isClearDisabled = startDate === consistentDefaultValue

  const handleTimePeriodChange = useCallback(
    (time, resolution) => {
      setResolution(resolution)
      setDates({
        startDate: time,
        endDate: 0,
      })
    },
    [setDates, setResolution]
  )
  const onDatepickerChange = (startDate, endDate) => {
    setDates({ startDate, endDate })
    const date = focusTagging === "finish" ? endDate || startDate : startDate || endDate
    reportEvent("date-picker", "click-date-picker", tagging, String(date))
  }

  const pickerDrop =
    ref.current && isOpen ? (
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
              <TimePeriods
                handleTimePeriodChange={handleTimePeriodChange}
                selectedDate={startDate}
                tagging={tagging}
              />
              <CustomTimePeriod
                handleTimePeriodChange={handleTimePeriodChange}
                value={startDate}
                resolution={resolution}
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
            gap={2}
          >
            {isValidTimePeriod && <PeriodIndication startDate={startDate} endDate={endDate} />}
            <Flex alignItems="center" justifyContent="center" gap={4}>
              <Button
                label="Clear"
                flavour="hollow"
                onClick={clearChanges}
                disabled={isClearDisabled}
                data-ga={`date-picker::click-clear::${tagging}-${focusTagging}`}
                data-testid="datePicker-clear"
              />
              <Button
                label="Apply"
                onClick={applyChanges}
                disabled={!isValidTimePeriod || isApplyDisabled}
                data-ga={`date-picker::click-apply::${tagging}-${focusTagging}`}
                data-testid="datePicker-apply"
              />
            </Flex>
          </Flex>
        </PickerBox>
      </StyledDrop>
    ) : null

  return (
    <>
      <AccessorElement
        onClick={togglePicker}
        tagging={tagging}
        isPickerOpen={isOpen}
        isPlaying={isPlaying}
        setRangeValues={onChange}
        start={initialStartDate}
        end={initialEndDate}
        ref={ref}
      />
      {pickerDrop}
    </>
  )
}

export default DatePickerDrop
