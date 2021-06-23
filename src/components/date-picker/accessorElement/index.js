import React, { useState, useMemo, useEffect } from "react"
import { useSelector } from "store/redux-separate-context"
import { Tooltip } from "@netdata/netdata-ui"
import {
  getStartDate,
  getEndDate,
  getIsSameDate,
  getDuration,
  MINUTE,
  getGranularDuration,
} from "./utils"
import Container from "./container"
import DateBox from "./dateBox"
import DurationBox from "./durationBox"
import PickerTooltip from "./pickerTooltip"
import { selectChartsAreFetching } from "@/src/domains/chart/selectors"

const PickerAccessorElement = ({
  onClick,
  start = 15 * MINUTE,
  end,
  isPlaying,
  setRangeValues,
}) => {
  const [timeframe, setTimeframe] = useState()
  const startDate = getStartDate(start)
  const endDate = getEndDate(end)

  useSelector(selectChartsAreFetching)

  useEffect(() => {
    const after = getDuration(startDate, endDate).as("seconds")
    if (!isPlaying && timeframe !== after) setTimeframe(after)
    if (isPlaying && timeframe) {
      setRangeValues({ start: Math.round(timeframe) })
      setTimeframe(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, timeframe, isPlaying])

  const isSameDate = useMemo(() => getIsSameDate(startDate, endDate), [startDate, endDate])
  const duration = useMemo(
    () => getGranularDuration(getDuration(startDate, endDate).as("milliseconds")),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isPlaying, startDate, endDate]
  )

  return (
    <Tooltip
      content={<PickerTooltip>Select a quick range or a specific timeframe</PickerTooltip>}
      align="bottom"
      stretch="align"
      plain
    >
      <Container
        alignItems="center"
        justifyContent="center"
        gap={1}
        height="100%"
        width={{ min: "380px" }}
        onClick={onClick}
        padding={[0, 1]}
      >
        <DateBox
          isPlaying={isPlaying}
          endDate={endDate}
          startDate={startDate}
          isSameDate={isSameDate}
        />
        <DurationBox isPlaying={isPlaying} duration={duration} />
      </Container>
    </Tooltip>
  )
}

export default PickerAccessorElement
