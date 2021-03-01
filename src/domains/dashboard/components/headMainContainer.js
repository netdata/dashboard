import React, { memo } from "react"
import { useContainer, useGetChart, useDashboardAttributes } from "domains/charts/providers/charts"
import { ChartHeads, useChartHeadDuration } from "domains/charts/providers/chartHead"
import { HeadMain } from "./head-main"

const HeadMainContainer = props => {
  const container = useContainer()
  const getChart = useGetChart()
  const { width } = container.getBoundingClientRect()
  const duration = useChartHeadDuration(width, 1)
  const { host, nodeIDs, ...restAttributes } = useDashboardAttributes()

  return (
    <ChartHeads {...props}>
      <HeadMain
        getChart={getChart}
        duration={duration}
        host={host}
        nodeIDs={nodeIDs}
        commonAttributesOverrides={restAttributes}
      />
    </ChartHeads>
  )
}

export default memo(HeadMainContainer, () => false)
