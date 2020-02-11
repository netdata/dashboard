import React, { useState, useLayoutEffect, useMemo, useRef } from "react"
import uuid from "uuid"

import { Attributes } from "domains/chart/utils/transformDataAttributes"
import { ChartContainer } from "domains/chart/components/chart-container"

interface Props {
  attributes: Attributes
  height?: number
  id?: string
  style?: React.CSSProperties
}

export const ChartWrapper = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
  attributes, height, id, style: styleOverride,
}: Props) => {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const [chartContainerElement, setChartContainerElement] = useState<HTMLDivElement>()
  useLayoutEffect(() => {
    if (!chartContainerElement && chartContainerRef.current) {
      setChartContainerElement(chartContainerRef.current)
    }
  }, [chartContainerElement])

  // const style = height
  //   ? { width: "100%", height: `${height}px` }
  //   : { width: "100%" }

  const chartUuid = useMemo(() => uuid.v4(), [])

  return (
    <div
      ref={chartContainerRef}
      className="dashboardjs-chart"
      id={id}
      role="application"
      style={styleOverride}
    >
      {chartContainerElement && (
        <ChartContainer
          attributes={attributes}
          chartUuid={chartUuid}
          portalNode={chartContainerElement}
        />
      )}
    </div>
  )
}
