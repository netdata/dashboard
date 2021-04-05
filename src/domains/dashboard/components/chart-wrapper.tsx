import React, { useState, useLayoutEffect, useMemo, useRef } from "react"
import getUuid from "uuid"

import { Attributes } from "domains/chart/utils/transformDataAttributes"
import { ChartContainer } from "domains/chart/components/chart-container"
import { DropdownMenu } from "domains/chart/components/chart-dropdown"
import { RenderCustomElementForDygraph } from "domains/chart/components/chart-with-loader"
import { ChartMetadata } from "domains/chart/chart-types"

const noop = () => {}

interface Props {
  attributes: Attributes
  height?: number
  id?: string
  uuid?: string
  style?: React.CSSProperties
  chartMetadata: ChartMetadata
  dropdownMenu?: DropdownMenu
  renderCustomElementForDygraph?: RenderCustomElementForDygraph
  onAttributesChange?: any
}

export const ChartWrapper = ({
  attributes,
  dropdownMenu,
  uuid,
  id,
  style: styleOverride,
  chartMetadata,
  renderCustomElementForDygraph,
  onAttributesChange = noop,
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

  const chartUuid = useMemo(() => getUuid.v4(), [])

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
          chartMetadata={chartMetadata}
          chartUuid={`${id}-${uuid}-${chartUuid}`}
          dropdownMenu={dropdownMenu}
          portalNode={chartContainerElement}
          renderCustomElementForDygraph={renderCustomElementForDygraph}
          onAttributesChange={onAttributesChange}
        />
      )}
    </div>
  )
}
