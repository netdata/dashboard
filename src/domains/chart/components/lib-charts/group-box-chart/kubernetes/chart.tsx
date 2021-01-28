/* eslint-disable react/prop-types */
// @ts-nocheck
import React, { useRef, useContext, useLayoutEffect, useState, memo, useEffect } from "react"
import { ChartContainer } from "domains/chart/components/chart-container"
import { ThemeContext } from "styled-components"
import { Flex, getColor } from "@netdata/netdata-ui"
import ChartOverview from "./chartOverview"

const Chart = ({ groupLabel, postGroupLabel, id, attributes, relatedIndex }) => {
  const theme = useContext(ThemeContext)
  const chartContainerRef = useRef()
  const [, repaint] = useState()

  useLayoutEffect(() => {
    repaint(true)
  }, [])

  const { chartMetadata, attributes: relatedChartAttributes } = attributes.relatedCharts[
    relatedIndex
  ]

  const labels = {
    k8s_cluster_id: [chartMetadata.chartLabels.k8s_cluster_id[0]],
    [attributes.groupBy]: [groupLabel],
    ...(postGroupLabel && { [attributes.postGroupBy]: [postGroupLabel] }),
  }

  const chartAttributes = {
    id: chartMetadata.id,

    width: "100%",
    height: "60px",

    chartLibrary: "sparkline",
    sparklineLineWidth: "2px",
    sparklineLineColor: getColor("border")({ theme }),
    sparklineFillColor: getColor("disabled")({ theme }),
    sparklineSpotRadius: 0,
    sparklineDisableTooltips: true,

    httpMethod: "POST",
    host: attributes.host,
    nodeIDs: attributes.nodeIDs,
    dimensions: relatedChartAttributes.dimensions,
    aggrMethod: relatedChartAttributes.aggrMethod,
    labels,
  }

  return (
    <Flex gap={2} column>
      <div ref={chartContainerRef} style={{ height: "60px", width: "100%" }}>
        {chartContainerRef.current && (
          <ChartContainer
            chartUuid={id}
            attributes={chartAttributes}
            chartMetadata={chartMetadata}
            portalNode={chartContainerRef.current}
          />
        )}
      </div>
      <ChartOverview id={id} chartMetadata={chartMetadata} />
    </Flex>
  )
}

export default memo(Chart)
