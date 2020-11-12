import React, { useState, useMemo, useEffect } from "react"
import "react-dates/initialize"
import "./custom-picker-styles.scss"
import { DateRangePicker } from "react-dates"
import moment, { Moment } from "moment"
import { Button } from "@netdata/netdata-ui"

import { useCloseOnOutsideClick } from "hooks/use-click-outside"

import {
  PickerActionArea, PickerBox, PickerBtnArea, HeaderSvg, StyledSidebar,
} from "./styled"
import { ShortPickArea } from "./short-pick"
import { PickerAccessorElement } from "./accessor-element"
import { CustomShortPicker } from "./custom-short-pick"
import { PickedValues } from "./types"
// @ts-ignore
import MonthLeftSvg from "./assets/month_arrow_l.svg"
// @ts-ignore
import MonthRightSvg from "./assets/month_arrow_r.svg"

function pickerFormat() {
  return "DD/MM/YYYY HH:mm"
}

function disabledDates(day: Moment): boolean {
  return day.diff(moment(), "seconds") > 0
}

const MonthLeft = () => (
  <HeaderSvg id="month_left">
    <use xlinkHref={`#${MonthLeftSvg.id}`} />
  </HeaderSvg>
)
const MonthRight = () => (
  <HeaderSvg id="month_right">
    <use xlinkHref={`#${MonthRightSvg.id}`} />
  </HeaderSvg>
)

type PickerPropsT = {
  isOpen: boolean
  pickedValues: PickedValues
  handleOpenState: (state: boolean) => void
  setRangeValues: (params: PickedValues) => void
  tagging?: string
}

type HandleRangeChangeT = {
  startDate: number | Moment | null
  endDate: number | Moment | null
}

function handleChangeDateByManualInput(
  dateToBeSet: Moment | number,
  setterFn: (date: number) => void,
): void {
  if (typeof dateToBeSet === "number") {
    setterFn(dateToBeSet)
  } else if (dateToBeSet) {
    const { input } = dateToBeSet.creationData()
    if (input && typeof input !== "number") {
      setterFn(moment(input, "DD/MM/YYYY HH:mm").valueOf())
    } else {
      setterFn(dateToBeSet.valueOf())
    }
  }
}

const convertToMoment = (time: number) => {
  if (time > 0) {
    return moment(time)
  }
  return moment(new Date().valueOf() + time * 1000)
}

const focusTaggingMap: { [key: string]: string } = {
  startDate: "start",
  endDate: "finish",
}

export const Picker = (props: PickerPropsT) => {
  const {
    isOpen, handleOpenState, setRangeValues, pickedValues, tagging = "",
  } = props

  const [startDateState, setStartDate] = useState<number>(pickedValues.start)
  const [endDateState, setEndDate] = useState<number>(pickedValues.end)

  const startDateMoment = useMemo(() => convertToMoment(startDateState), [startDateState])
  const endDateMoment = useMemo(() => convertToMoment(endDateState), [endDateState])

  useEffect(() => {
    setStartDate(pickedValues.start)
  }, [pickedValues.start])

  useEffect(() => {
    setEndDate(pickedValues.end)
  }, [pickedValues.end])

  const [focusedInput, setFocusedInput] = useState<any>("startDate")

  function handleDatesChange({ startDate, endDate }: HandleRangeChangeT) {
    if (startDate === null || endDate === null) {
      // nulls can happen when date is not properly entered in input field
      return
    }
    handleChangeDateByManualInput(endDate, setEndDate)
    handleChangeDateByManualInput(startDate, setStartDate)
  }
  function clear() {
    setEndDate(0)
    setStartDate(-60 * 15)
    setRangeValues({
      start: -60 * 15,
      end: 0,
    })
  }

  function close() {
    handleOpenState(false)
  }
  const ref = useCloseOnOutsideClick(close)

  function keepFocus(fi: any) {
    if (!fi) return
    setFocusedInput(fi)
  }
  function clickApply() {
    setRangeValues({
      start: startDateState,
      end: endDateState,
    })
    close()
  }


  const focusTagging = focusTaggingMap[focusedInput]

  const pickerModal = (
    <StyledSidebar right closeOnEsc closeOnOverlayClick>
      <PickerBox ref={ref}>
        <PickerActionArea>
          <ShortPickArea
            handleDatesChange={handleDatesChange}
            selectedStart={startDateState}
            tagging={tagging}
          />
          <DateRangePicker
            onDatesChange={handleDatesChange}
            daySize={30}
            focusedInput={focusedInput}
            onFocusChange={keepFocus}
            hideKeyboardShortcutsPanel
            enableOutsideDays
            isOutsideRange={disabledDates}
            firstDayOfWeek={1}
            verticalSpacing={0}
            displayFormat={pickerFormat}
            endDate={endDateMoment}
            startDate={startDateMoment}
            startDateId="dpStartDateInput"
            openDirection="up"
            endDateId="dpEndDateInput"
            navNext={<MonthRight />}
            navPrev={<MonthLeft />}
          />
        </PickerActionArea>
        <PickerBtnArea>
          <CustomShortPicker
            setRangeValues={setRangeValues}
            handleDatesChange={handleDatesChange}
            selectedStart={startDateState}
            tagging={tagging}
          />
          <Button
            label="CLEAR"
            flavour="borderless"
            onClick={clear}
            data-testid={`date-picker::click-clear::${tagging}-${focusTagging}`}
          />
          <Button
            label="APPLY"
            onClick={clickApply}
            data-testid={`date-picker::click-apply::${tagging}-${focusTagging}`}
          />
        </PickerBtnArea>
      </PickerBox>
    </StyledSidebar>
  )

  return (
    <>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <PickerAccessorElement onClick={() => handleOpenState(true)} {...pickedValues} />
      {isOpen && pickerModal}
    </>
  )
}
