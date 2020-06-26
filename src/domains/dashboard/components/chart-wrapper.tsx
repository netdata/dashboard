import React, {
  useState, useLayoutEffect, useMemo, useRef,
} from "react"
import uuid from "uuid"
import { Attributes } from "domains/chart/utils/transformDataAttributes"
import { ChartContainer } from "domains/chart/components/chart-container"
import { DropdownMenu } from "domains/chart/components/chart-dropdown"
import { ChartMetadata } from "domains/chart/chart-types"

interface Props {
  attributes: Attributes
  height?: number
  id?: string
  style?: React.CSSProperties
  chartMetadata: ChartMetadata
  dropdownMenu?: DropdownMenu
}

export const ChartWrapper = ({
  attributes,
  dropdownMenu,
  id,
  style: styleOverride,
  chartMetadata,
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
          chartMetadata={chartMetadata}
          chartUuid={chartUuid}
          dropdownMenu={dropdownMenu}
          portalNode={chartContainerElement}
        />
      )}
    </div>
  )
}
