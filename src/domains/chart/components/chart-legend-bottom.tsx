import React from "react"
import { useDateTime } from "utils/date-time"
import { legendPluginModuleString, legendResolutionTooltip } from "domains/chart/utils/legend-utils"
import { ChartMetadata, DygraphData } from "../chart-types"

import * as S from "./chart-legend-bottom.styled"

interface Props {
  chartData: DygraphData
  chartMetadata: ChartMetadata
  chartLibrary: string
  colors: {
    [key: string]: string
  }
  dimensionNames: string[]
  hoveredRow: number
  hoveredX: number | null
  legendFormatValue: (value: number | string | null) => number | string
  onDimensionClick: (clickedDimensionName: string, event: React.MouseEvent) => void
  selectedDimensions: string[]
  showLatestOnBlur: boolean
  unitsCurrent: string
  viewBefore: number
  legendToolbox: JSX.Element
  resizeHandler: React.ReactNode
}

export const ChartTimeframe = ({
  chartMetadata,
  showUndefined,
  hoveredX,
  viewBefore,
  chartData,
}: any) => {
  const { localeDateString, localeTimeString } = useDateTime()

  const legendDate = new Date(hoveredX || viewBefore)

  return (
    <div>
      <span title={legendPluginModuleString(true, chartMetadata)}>
        {showUndefined
          ? legendPluginModuleString(false, chartMetadata)
          : localeDateString(legendDate)}
      </span>
      <S.DateTimeSeparator>|</S.DateTimeSeparator>
      <span title={legendResolutionTooltip(chartData, chartMetadata)}>
        {showUndefined ? chartMetadata.context.toString() : localeTimeString(legendDate)}
      </span>
    </div>
  )
}

export const ChartLegendBottom = ({
  chartData,
  chartMetadata,
  colors,
  dimensionNames,
  hoveredRow,
  hoveredX,
  legendFormatValue,
  onDimensionClick,
  selectedDimensions,
  showLatestOnBlur,
  unitsCurrent,
  viewBefore,
  legendToolbox,
  resizeHandler,
}: Props) => {
  const showUndefined = hoveredRow === -1 && !showLatestOnBlur

  return (
    <S.LegendContainer>
      <S.LegendFirstRow>
        <S.LegendUnit>{unitsCurrent}</S.LegendUnit>
        <ChartTimeframe
          chartMetadata={chartMetadata}
          showUndefined={showUndefined}
          hoveredX={hoveredX}
          viewBefore={viewBefore}
          chartData={chartData}
        />
      </S.LegendFirstRow>
      <S.LegendSecondRow>
        <S.LegendItems>
          {dimensionNames.map((dimensionName, i) => {
            const color = colors[dimensionName]

            const isSelected =
              selectedDimensions.length === 0 || selectedDimensions.includes(dimensionName)

            let value
            if (showUndefined) {
              value = null
            } else if (hoveredRow !== -1) {
              const hoveredValueArray = chartData.result.data[hoveredRow]
              // [timestamp, valueDim1, valueDim2, ...]
              value = hoveredValueArray ? hoveredValueArray[i + 1] : null
            } else {
              value = chartData.view_latest_values[i]
            }
            return (
              <S.DimensionItem
                color={color}
                onClick={(event) => {
                  onDimensionClick(dimensionName, event)
                }}
                role="button"
                tabIndex={0}
                isDisabled={!isSelected}
                key={dimensionName}
              >
                <S.DimensionIcon title={dimensionName} color={color} />
                <S.DimensionLabel>{dimensionName}</S.DimensionLabel>
                <S.DimensionValue>{isSelected && legendFormatValue(value)}</S.DimensionValue>
              </S.DimensionItem>
            )
          })}
          <S.DimensionItemToolboxPlaceholder />
        </S.LegendItems>
        <S.ToolboxContainer>
          {legendToolbox}
          {resizeHandler}
        </S.ToolboxContainer>
      </S.LegendSecondRow>
    </S.LegendContainer>
  )
}
