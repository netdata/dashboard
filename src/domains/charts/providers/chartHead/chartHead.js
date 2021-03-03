import React, { useMemo, forwardRef } from "react"
import { Flex } from "@netdata/netdata-ui"
import { ChartWrapper } from "domains/dashboard/components/chart-wrapper"
import { withChartProps, useContainer } from "domains/charts/providers/charts"
import useDuration from "./useDuration"

export const ChartHead = ({ chart, chartAttributes, menuChartAttributes, width, ...rest }) => {
  const duration = useDuration(width, chart.update_every)

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

export const ChartHeads = forwardRef((props, ref) => (
  <Flex justifyContent="center" ref={ref} {...props} />
))

export const ChartHeadsContainer = ({ ids, ...rest }) => {
  const container = useContainer()
  const { width } = container.getBoundingClientRect()

  return (
    <ChartHeads {...rest}>
      {width > 0 && ids.map(id => <ChartHeadContainer key={id} id={id} width={width} />)}
    </ChartHeads>
  )
}
