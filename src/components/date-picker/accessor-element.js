import React, { useState, useMemo, useEffect } from "react"
import moment from "moment"
import { Tooltip, Flex, TextSmall, Icon } from "@netdata/netdata-ui"
import { MINUTE } from "./utils"

moment.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "last %s",
    s: "sec",
    ss: "%ss",
    m: "min",
    mm: "%d min",
    h: "hour",
    hh: "%dh",
    d: "day",
    dd: "%dd",
    M: "mo",
    MM: "%d mo",
    y: "year",
    yy: "%d year",
  },
})

const CustomTooltip = () => (
  <Flex
    padding={[1, 2]}
    margin={[1]}
    background={["neutral", "black"]}
    round={1}
    justifyContent="center"
  >
    <TextSmall color="bright">Select a specific timeframe of minutes or days</TextSmall>
  </Flex>
)

const getStartDate = start => (start < 0 ? moment(new Date()).add(start, "seconds") : moment(start))
const getEndDate = end => (!end ? moment(new Date()) : moment(end))
const getEndAlias = (startDate, endDate) =>
  startDate.isSame(endDate, "day")
    ? endDate.format("HH:mm:ss")
    : endDate.format("DD/MM/YYYY HH:mm:ss")

export const PickerAccessorElement = ({ onClick, start = 15 * MINUTE, end, isPlaying }) => {
  const [startDate, setStartDate] = useState(getStartDate(start))
  const [endDate, setEndDate] = useState(getEndDate(end))

  useEffect(() => {
    setStartDate(getStartDate(start))
    setEndDate(getEndDate(end))
  }, [start, end, isPlaying])

  const endAlias = useMemo(() => getEndAlias(startDate, endDate), [startDate, endDate])
  const duration = useMemo(
    () => startAlias.from(endDate, isPlaying),
    [startAlias, endDate, isPlaying]
  )

  return (
    <Tooltip content={CustomTooltip} align="bottom" stretch="align" plain>
      <Flex
        alignItems="center"
        justifyContent="center"
        gap={1}
        width={{ min: "300px" }}
        height="100%"
        onClick={onClick}
      >
        <TextSmall color="text">
          {startDate.format("DD/MM/YYYY")} •{" "}
          <TextSmall color={isPlaying ? "accent" : "textFocus"}>
            {startDate.format("HH:mm:ss")}
          </TextSmall>
        </TextSmall>
        <Icon
          name="arrow_left"
          color={isPlaying ? "accent" : "textFocus"}
          size="small"
          rotate={2}
        />
        <TextSmall color={isPlaying ? "accent" : "textFocus"}>{endAlias}</TextSmall>
        <TextSmall color="text"> • {duration}</TextSmall>
      </Flex>
    </Tooltip>
  )
}
