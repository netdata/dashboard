import React, { useMemo, useRef, useLayoutEffect, useState } from "react"
import { ChartContainer } from "domains/chart/components/chart-container/chart-container"
import { withChartProps } from "./context"
import useEstimatedHeight from "./useEstimatedHeight"

export const ChartMenu = ({ id, uuid, menuChartAttributes, chartAttributes, chart }) => {
  const ref = useRef()
  const [container, setContainer] = useState()
  const { link } = menuChartAttributes
  const { legendPosition } = chartAttributes

  useLayoutEffect(() => {
    setContainer(ref.current)
  }, [])

  const height = useEstimatedHeight(id, legendPosition)

  const attributes = useMemo(
    () => ({
      ...menuChartAttributes,
      ...chartAttributes,
      height,
    }),
    [menuChartAttributes, chartAttributes, height]
  )

  return (
    <div
      ref={ref}
      className="dashboardjs-chart"
      id={link}
      role="application"
      data-height={attributes.height}
    >
      {container && (
        <ChartContainer
          attributes={attributes}
          chartMetadata={chart}
          chartUuid={id}
          uuid={uuid}
          dropdownMenu={null}
          portalNode={container}
          renderCustomElementForDygraph={null}
          onAttributesChange={null}
        />
      )}
    </div>
  )
}

export const ChartMenuContainer = withChartProps(ChartMenu)
