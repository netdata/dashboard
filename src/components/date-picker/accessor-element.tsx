import React from "react"
import moment from "moment"

import {
  AccessorBox, HeaderSvg, IconSpacer, StartEndContainer, ArrowsIcon,
} from "./styled"
import { PickedValues } from "./types"
import { getShortHandTimeAlias, MINUTE } from "./utils"
// @ts-ignore
import ArrowSvg from "./assets/arrow.svg"
// @ts-ignore
import CalendarSvg from "./assets/calendar.svg"

const Arrow = () => (
  <HeaderSvg>
    <use xlinkHref={`#${ArrowSvg.id}`} />
  </HeaderSvg>
)

const Calendar = () => (
  <IconSpacer>
    <HeaderSvg>
      <use xlinkHref={`#${CalendarSvg.id}`} />
    </HeaderSvg>
  </IconSpacer>
)

type PickerAccessorPropsT = {
  onClick: () => void
} & PickedValues

export const PickerAccessorElement = (props: PickerAccessorPropsT) => {
  const { onClick, start = 15 * MINUTE, end } = props
  if (start < 0) {
    return (
      <AccessorBox onClick={onClick}>
        <Calendar />
        <>{getShortHandTimeAlias(-start)}</>
      </AccessorBox>
    )
  }
  const startAlias = moment(start).format("DD/MM/YYYY HH:mm")
  const endAlias = moment(end).format("DD/MM/YYYY HH:mm")
  return (
    <AccessorBox onClick={onClick}>
      <Calendar />
      <StartEndContainer>
        <div>
          {startAlias}
        </div>
        <div>
          {endAlias}
        </div>
      </StartEndContainer>
      <ArrowsIcon name="arrows_vertical" />
    </AccessorBox>
  )
}
