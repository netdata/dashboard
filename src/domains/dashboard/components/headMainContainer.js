import React, { memo } from "react"
import { useContainer, useGetChart, useDashboardAttributes } from "domains/charts/charts"
import { ChartHeadsWrapper, useChartHeadDuration } from "domains/charts/chartHead"
import { HeadMain } from "./head-main"

const HeadMainContainer = ({ uuid, ...rest }) => {
  const container = useContainer()
  const getChart = useGetChart()
  const { width } = container.getBoundingClientRect()
  const duration = useChartHeadDuration(width, 1)
  const { host, nodeIDs, ...restAttributes } = useDashboardAttributes()

  return (
    <ChartHeadsWrapper {...rest}>
      <HeadMain
        getChart={getChart}
        duration={duration}
        host={host}
        nodeIDs={nodeIDs}
        commonAttributesOverrides={restAttributes}
        uuid={uuid}
      />
    </ChartHeadsWrapper>
  )
}

export default memo(HeadMainContainer)
