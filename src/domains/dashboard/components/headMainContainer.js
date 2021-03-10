import React, { memo } from "react"
import { useContainer, useGetChart, useDashboardAttributes } from "domains/charts/charts"
import { ChartHeadsWrapper, useChartHeadDuration } from "domains/charts/chartHead"
import { HeadMain } from "./head-main"

const HeadMainContainer = props => {
  const container = useContainer()
  const getChart = useGetChart()
  const { width } = container.getBoundingClientRect()
  const duration = useChartHeadDuration(width, 1)
  const { host, nodeIDs, ...restAttributes } = useDashboardAttributes()

  return (
    <ChartHeadsWrapper {...props}>
      <HeadMain
        getChart={getChart}
        duration={duration}
        host={host}
        nodeIDs={nodeIDs}
        commonAttributesOverrides={restAttributes}
      />
    </ChartHeadsWrapper>
  )
}

export default memo(HeadMainContainer)
