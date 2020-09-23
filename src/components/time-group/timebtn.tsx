import React from "react"
import { TimeButton } from "./styled"

type TimeBtnProps = {
  setTimeOffset: (selected: string, gap: number) => void
  gap: number
  children: string
  isSelected: boolean
}

export const TimeBtn = ({
  gap, isSelected = false, children, setTimeOffset,
}: TimeBtnProps) => (
  <TimeButton
    isSelected={isSelected}
    onClick={(event) => {
      event.stopPropagation()
      setTimeOffset(children, gap)
    }}
  >
    {children}
  </TimeButton>
)
