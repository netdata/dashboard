/* eslint-disable react/prop-types */
// @ts-nocheck
import React, { useRef, useLayoutEffect, useState } from "react"
import { Flex, Text } from "@netdata/netdata-ui"
import { netdataDashboard } from "domains/dashboard/utils/netdata-dashboard"
import { ChartContainer } from "domains/chart/components/chart-container"
import styled from "styled-components"

const StyledChartContainer = styled(Text)`
  .netdata-container {
    display: initial;
  }
  .netdata-chart {
    display: initial;
    position: initial;
    top: initial;
    left: initial;
  }
`

const Title = styled(Text)`
  text-overflow: ellipsis;
  max-width: 120px;
  overflow-x: hidden;
`

const getUnitSign = (unit) => {
  return unit === "percentage" ? "%" : ` ${unit.replace(/milliseconds/, "ms")}`
}

const ChartOverview = ({ id, attributes, relatedIndex }) => {
  const chartContainerRef = useRef()
  const [, repaint] = useState()

  useLayoutEffect(() => {
    repaint(true)
  }, [])

  const { chartMetadata, attributes: relatedChartAttributes } = attributes.relatedCharts[
    relatedIndex
  ]

  const chartAttributes = {
    id: chartMetadata.id,
    chartLibrary: "textonly",
    httpMethod: "POST",
    host: attributes.host,
    nodeIDs: attributes.nodeIDs,
    dimensions: relatedChartAttributes.dimensions,
    aggrMethod: relatedChartAttributes.aggrMethod,
    textOnlySuffix: getUnitSign(chartMetadata.units),
  }

  const icon = netdataDashboard.menuIcon(chartMetadata)
  const title = chartMetadata.id.replace(/cgroup\./, "")

  return (
    <Flex justifyContent="between" gap={2}>
      <Text color={["white", "pure"]} dangerouslySetInnerHTML={{ __html: icon }} />
      <Title color={["white", "pure"]}>{title}</Title>
      <StyledChartContainer color={["white", "pure"]} margin={[0, 0, 0, "auto"]}>
        <div ref={chartContainerRef}>
          {chartContainerRef.current && (
            <ChartContainer
              chartUuid={id}
              attributes={chartAttributes}
              chartMetadata={chartMetadata}
              portalNode={chartContainerRef.current}
            />
          )}
        </div>
      </StyledChartContainer>
    </Flex>
  )
}

export default ChartOverview
