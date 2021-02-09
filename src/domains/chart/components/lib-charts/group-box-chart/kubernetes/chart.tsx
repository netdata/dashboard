/* eslint-disable comma-dangle */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable object-curly-newline */
/* eslint-disable react/prop-types */
// @ts-nocheck
import React, { useRef, useContext, useLayoutEffect, useState, memo, useMemo } from "react"
import { throttle } from "throttle-debounce"
import { ChartContainer } from "domains/chart/components/chart-container"
import { ThemeContext } from "styled-components"
import { Flex, getColor } from "@netdata/netdata-ui"
import ChartOverview from "./chartOverview"

const Chart = ({ groupLabel, postGroupLabel, id, attributes, relatedIndex }) => {
  const theme = useContext(ThemeContext)
  const chartContainerRef = useRef()
  const [displayedIndex, setDisplayedIndex] = useState()
  const setDisplayedIndexThrottled = useMemo(() => throttle(400, setDisplayedIndex), [])
  const [, repaint] = useState()

  useLayoutEffect(() => {
    repaint(true)
  }, [])

  const { chartMetadata, attributes: relatedChartAttributes } = attributes.relatedCharts[
    relatedIndex
  ]

  const chartAttributes = useMemo(
    () => ({
      id: chartMetadata.id,

      width: "100%",
      height: "60px",

      chartLibrary: "sparkline",
      sparklineLineWidth: "2px",
      sparklineLineColor: getColor("border")({ theme }),
      sparklineFillColor: getColor("disabled")({ theme }),
      sparklineSpotRadius: 0,
      sparklineDisableTooltips: true,
      sparklineOnHover: (event) => setDisplayedIndexThrottled(event?.x),

      httpMethod: "POST",
      host: attributes.host,
      nodeIDs: attributes.nodeIDs,
      dimensions: relatedChartAttributes.dimensions,
      aggrMethod: relatedChartAttributes.aggrMethod,

      labels: {
        k8s_cluster_id: [chartMetadata.chartLabels.k8s_cluster_id[0]],
        [attributes.groupBy]: [groupLabel],
        ...(postGroupLabel && { [attributes.postGroupBy]: [postGroupLabel] }),
      },
    }),
    [chartMetadata, attributes]
  )

  return (
    <Flex gap={2} column data-testid="k8sPopoverChart">
      <div
        ref={chartContainerRef}
        style={{ height: "60px", width: "100%" }}
        data-testid="k8sPopoverChart-container"
      >
        {chartContainerRef.current && (
          <ChartContainer
            chartUuid={id}
            attributes={chartAttributes}
            chartMetadata={chartMetadata}
            portalNode={chartContainerRef.current}
          />
        )}
      </div>
      <ChartOverview
        id={id}
        aggrMethod={chartAttributes.aggrMethod}
        chartMetadata={chartMetadata}
        displayedIndex={displayedIndex}
      />
    </Flex>
  )
}

export default memo(Chart)
