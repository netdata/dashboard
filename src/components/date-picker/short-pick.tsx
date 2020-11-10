import React from "react"
import {
  ShortPick, ShortPickElement, HeaderSvg, ShortPickHeader,
} from "./styled"
// @ts-ignore
import Clock from "./assets/header-clock.svg"

type ShortPickerPropsT = {
  handleDatesChange: any
  selectedStart: number
  tagging: string
}
const AlarmClock = () => (
  <HeaderSvg>
    <use xlinkHref={`#${Clock.id}`} />
  </HeaderSvg>
)
const MINUTE = 60
const HOUR = MINUTE * 60
const DAY = 24 * HOUR
const PRESET_RANGES: [string, number][] = [
  ["Last 5 minutes", -5 * MINUTE],
  ["Last 15 minutes", -15 * MINUTE],
  ["Last 30 minutes", -30 * MINUTE],
  ["Last 6 hours", -6 * HOUR],
  ["Last 12 hours", -12 * HOUR],
  ["Last 7 days", -7 * DAY],
]

export const ShortPickArea = (props: ShortPickerPropsT) => {
  const { handleDatesChange, selectedStart, tagging } = props

  function applyChanges(alias: string, timeCorrection: number) {
    return () => {
      handleDatesChange({
        startDate: timeCorrection,
        endDate: 0,
      })
    }
  }
  return (
    <ShortPick>
      <ShortPickHeader>
        <AlarmClock />
        &nbsp; Quick Selector
      </ShortPickHeader>
      {PRESET_RANGES.map(([text, time]) => (
        <ShortPickElement
          key={time}
          onClick={applyChanges(text, time)}
          isSelected={time === selectedStart}
          data-testid={`date-picker::click-quick-selector::${tagging}::${-time}`}
        >
          {text}
        </ShortPickElement>
      ))}
    </ShortPick>
  )
}
