/* eslint-disable object-curly-newline */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable operator-linebreak */
/* eslint-disable arrow-body-style */
/* eslint-disable react/prop-types */
// @ts-nocheck
import React, { memo } from "react"
import styled from "styled-components"
import { Flex, Text } from "@netdata/netdata-ui"
import { useSelector } from "store/redux-separate-context"
import { useFormatters } from "domains/chart/utils/formatters"
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

const aggrMethods = {
  avg: "Average",
  sum: "Sum",
  min: "Min",
  max: "Max",
}
const getAggregation = (value) => `${aggrMethods[value]}` || ""

const ChartValueContainer = memo(({ id, units, aggrMethod, displayedIndex }) => {
  const chartData = useSelector((state: AppStateT) => selectChartData(state, { id }))

  const value =
    typeof displayedIndex === "number"
      ? chartData.result[displayedIndex]
      : chartData.view_latest_values[0]

  const { legendFormatValue, unitsCurrent } = useFormatters({
    attributes: {},
    data: chartData,
    units,
    unitsCommon: null,
    unitsDesired: null,
    uuid: id,
  })

  const aggregation = getAggregation(aggrMethod)

  return (
    <Text
      wordBreak="keep-all"
      color={["white", "pure"]}
      margin={[0, 0, 0, "auto"]}
      data-testid="k8sPopoverChart-chartValue"
    >
      {aggregation && (
        <Text
          margin={[0, 1, 0, 0]}
          color={["gray", "nepal"]}
          data-testid="k8sPopoverChart-chartValue-aggr"
        >
          {aggregation}
        </Text>
      )}
      {legendFormatValue(value)}
      {getUnitSign(unitsCurrent)}
    </Text>
  )
})

const ChartValue = ({ id, ...rest }) => {
  const chartData = useSelector((state: AppStateT) => selectChartData(state, { id }))

  if (!chartData || chartData.result.length === 0) return null
  return <ChartValueContainer id={id} {...rest} />
}

const ChartOverview = ({ id, chartMetadata, aggrMethod, displayedIndex }) => {
  const { units, context } = chartMetadata
  const title = context.replace(/cgroup\./, "")
  const icon = netdataDashboard.menuIcon(chartMetadata)

  return (
    <Flex gap={2} data-testid="k8sPopoverChart-overview">
      <Text color={["white", "pure"]} dangerouslySetInnerHTML={{ __html: icon }} />
      <Title color={["white", "pure"]} data-testid="k8sPopoverChart-title">
        {title}
      </Title>
      <ChartValue id={id} units={units} aggrMethod={aggrMethod} displayedIndex={displayedIndex} />
    </Flex>
  )
}

export default memo(ChartOverview)
