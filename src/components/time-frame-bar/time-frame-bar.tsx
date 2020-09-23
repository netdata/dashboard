import React from "react"
import Headroom from "react-headroom"

import { TimeGroup } from "components/time-group"

import { Bar } from "./styled"

export const TimeFrameBar = () => {
  const wrapperStyle = {
    position: ("fixed" as "fixed"),
    width: "100%",
    top: 0,
    left: 0,
    zIndex: 3,
  }
  return (
    <Headroom wrapperStyle={wrapperStyle}>
      <Bar>
        <TimeGroup />
      </Bar>
    </Headroom>
  )
}
