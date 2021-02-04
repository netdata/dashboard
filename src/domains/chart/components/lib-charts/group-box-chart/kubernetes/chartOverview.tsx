/* eslint-disable arrow-body-style */
/* eslint-disable react/prop-types */
// @ts-nocheck
import React, { memo } from "react"
import styled from "styled-components"
import { Flex, Text } from "@netdata/netdata-ui"
import { useSelector } from "store/redux-separate-context"
import { netdataDashboard } from "domains/dashboard/utils/netdata-dashboard"
import { selectChartData } from "domains/chart/selectors"

const Title = styled(Text)`
  text-overflow: ellipsis;
  max-width: 120px;
  overflow-x: hidden;
`

const getUnitSign = (unit) => {
  return unit === "percentage" ? "%" : ` ${unit.replace(/milliseconds/, "ms")}`
}

const ChartValue = ({ id, chartMetadata, displayedIndex }) => {
  const chartData = useSelector((state: AppStateT) => selectChartData(state, { id }))

  if (!chartData || chartData.result.length === 0) return null

  const index = typeof displayedIndex === "number" ? displayedIndex : chartData.result.length - 1
  const unit = getUnitSign(chartMetadata.units)

  return (
    <Text wordBreak="keep-all" color={["white", "pure"]} margin={[0, 0, 0, "auto"]}>
      {chartData.result[index]}
      {unit}
    </Text>
  )
}

const ChartOverview = ({ id, chartMetadata, displayedIndex }) => {
  const icon = netdataDashboard.menuIcon(chartMetadata)
  const title = chartMetadata.context.replace(/cgroup\./, "")

  return (
    <Flex gap={2}>
      <Text color={["white", "pure"]} dangerouslySetInnerHTML={{ __html: icon }} />
      <Title color={["white", "pure"]}>{title}</Title>
      <ChartValue id={id} chartMetadata={chartMetadata} displayedIndex={displayedIndex} />
    </Flex>
  )
}

export default memo(ChartOverview)
