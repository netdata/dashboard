import React, { useMemo, forwardRef } from "react"
import { Flex } from "@netdata/netdata-ui"
import { ChartWrapper } from "domains/dashboard/components/chart-wrapper"
import { withChartProps } from "domains/charts/charts"
import useDuration from "./useDuration"

export const ChartHead = ({ chart, chartAttributes, menuChartAttributes, ...rest }) => {
  const duration = useDuration(chart.update_every)

  const attributes = useMemo(
    () => ({
      ...menuChartAttributes,
      ...chartAttributes,
      after: -duration,
      points: duration,
    }),
    [chartAttributes, menuChartAttributes, duration]
  )
  return <ChartWrapper attributes={attributes} chartMetadata={chart} {...rest} />
}

export const ChartHeadContainer = withChartProps(ChartHead)

export const ChartHeadsWrapper = forwardRef((props, ref) => (
  <Flex justifyContent="center" alignItems="baseline" ref={ref} {...props} />
))

export const ChartHeadsContainer = ({ ids, ...rest }) => (
  <ChartHeadsWrapper {...rest}>
    {ids.map(id => (
      <ChartHeadContainer key={id} id={id} />
    ))}
  </ChartHeadsWrapper>
)
