import React, { memo } from "react"
import { useContainer, useGetChart, useDashboardAttributes } from "domains/charts/charts"
import { ChartHeadsWrapper, useChartHeadDuration } from "domains/charts/chartHead"
import { HeadMain } from "./head-main"

const HeadMainContainer = ({ id, uuid = "", ...rest }) => {
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
        id={`${id}-${uuid}`}
      />
    </ChartHeadsWrapper>
  )
}

export default memo(HeadMainContainer)
