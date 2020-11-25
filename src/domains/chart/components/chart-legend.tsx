import React from "react"

import { getNewSelectedDimensions } from "domains/chart/utils/legend-utils"
import { Attributes } from "../utils/transformDataAttributes"
import { ChartMetadata, DygraphData } from "../chart-types"

import { ChartLegendRight } from "./chart-legend-right"
import { ChartLegendBottom } from "./chart-legend-bottom"

interface Props {
  attributes: Attributes
  chartData: DygraphData
  chartMetadata: ChartMetadata
  chartLibrary: string
  colors: {
    [key: string]: string
  }
  hoveredRow: number
  hoveredX: number | null
  legendFormatValue: (value: number | string | null) => (number | string)
  selectedDimensions: string[]
  setSelectedDimensions: (selectedDimensions: string[]) => void
  showLatestOnBlur: boolean
  unitsCurrent: string
  viewBefore: number
  legendToolbox: JSX.Element
  resizeHandler: React.ReactNode
}

export const ChartLegend = ({
  attributes,
  chartData,
  chartMetadata,
  chartLibrary,
  colors,
  hoveredRow,
  hoveredX,
  legendFormatValue,
  selectedDimensions,
  setSelectedDimensions,
  showLatestOnBlur,
  unitsCurrent,
  viewBefore,
  legendToolbox,
  resizeHandler,
}: Props) => {
  const onDimensionClick = (clickedDimensionName: string, event: React.MouseEvent) => {
    event.preventDefault()
    const isModifierKeyPressed = event.shiftKey || event.ctrlKey
    const newSelectedDimensions = getNewSelectedDimensions({
      allDimensions: chartData.dimension_names,
      selectedDimensions,
      clickedDimensionName,
      isModifierKeyPressed,
    })
    setSelectedDimensions(newSelectedDimensions)
  }

  if (attributes.legendPosition === "bottom") {
    return (
      <ChartLegendBottom
        chartData={chartData}
        chartLibrary={chartLibrary}
        chartMetadata={chartMetadata}
        colors={colors}
        dimensionNames={chartData.dimension_names}
        hoveredRow={hoveredRow}
        hoveredX={hoveredX}
        legendFormatValue={legendFormatValue}
        onDimensionClick={onDimensionClick}
        selectedDimensions={selectedDimensions}
        showLatestOnBlur={showLatestOnBlur}
        unitsCurrent={unitsCurrent}
        viewBefore={viewBefore}
        legendToolbox={legendToolbox}
        resizeHandler={resizeHandler}
      />
    )
  }

  return (
    <ChartLegendRight
      chartData={chartData}
      chartLibrary={chartLibrary}
      chartMetadata={chartMetadata}
      colors={colors}
      dimensionNames={chartData.dimension_names}
      hoveredRow={hoveredRow}
      hoveredX={hoveredX}
      legendFormatValue={legendFormatValue}
      onDimensionClick={onDimensionClick}
      selectedDimensions={selectedDimensions}
      showLatestOnBlur={showLatestOnBlur}
      unitsCurrent={unitsCurrent}
      viewBefore={viewBefore}
    />
  )
}
