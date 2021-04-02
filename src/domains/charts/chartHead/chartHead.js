import React, { useMemo, forwardRef } from "react"
import { Flex } from "@netdata/netdata-ui"
import { ChartWrapper } from "domains/dashboard/components/chart-wrapper"
import { withChartHeadProps } from "domains/charts/charts"
import useDuration from "./useDuration"

export const ChartHead = ({ chart, dashboardAttributes, menuChartAttributes, ...rest }) => {
  const duration = useDuration(chart.update_every)

  const attributes = useMemo(
    () => ({
      ...menuChartAttributes,
      ...dashboardAttributes,
      after: -duration,
      points: duration,
    }),
    [dashboardAttributes, menuChartAttributes, duration]
  )
  return <ChartWrapper attributes={attributes} chartMetadata={chart} {...rest} />
}

export const ChartHeadContainer = withChartHeadProps(ChartHead)

export const ChartHeadsWrapper = forwardRef((props, ref) => (
  <Flex justifyContent="center" alignItems="baseline" ref={ref} {...props} />
))

export const ChartHeadsContainer = ({ ids, uuid, ...rest }) => (
  <ChartHeadsWrapper {...rest}>
    {ids.map(id => (
      <ChartHeadContainer key={id} id={id} uuid={uuid} />
    ))}
  </ChartHeadsWrapper>
)
