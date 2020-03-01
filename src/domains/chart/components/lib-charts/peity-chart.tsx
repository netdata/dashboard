// @ts-ignore "declare module" doesn't work properly when importing dashboard in cloud
import "peity"
import React, {
  useRef, useState, useLayoutEffect,
} from "react"

import { Attributes } from "domains/chart/utils/transformDataAttributes"
import { ChartMetadata, EasyPieChartData } from "domains/chart/chart-types"
import { colorLuminance } from "domains/chart/utils/color-luminance"

interface Props {
  attributes: Attributes
  chartContainerElement: HTMLElement
  chartData: EasyPieChartData
  chartMetadata: ChartMetadata
  chartElementClassName: string
  chartElementId: string
  orderedColors: string[]
}
export const PeityChart = ({
  attributes,
  chartContainerElement,
  chartData,
  chartMetadata,
  chartElementClassName,
  chartElementId,
  orderedColors,
}: Props) => {
  const chartElement = useRef<HTMLDivElement>(null)

  // update width, height automatically each time
  const [$chartElement, set$chartElement] = useState()
  const peityOptions = useRef<{
    stroke: string,
    fill: string,
    strokeWidth: number,
    width: number,
    height: number,
  }>()


  // create chart
  useLayoutEffect(() => {
    if (chartElement.current && !$chartElement) {
      const $element = window.$(chartElement.current)

      const { width, height } = chartContainerElement.getBoundingClientRect()

      const {
        peityStrokeWidth = 1,
      } = attributes
      const peityInitOptions = {
        stroke: window.NETDATA.themes.current.foreground,
        strokeWidth: peityStrokeWidth,
        width: Math.floor(width),
        height: Math.floor(height),
        fill: window.NETDATA.themes.current.foreground,
      }

      set$chartElement(() => $element)
      peityOptions.current = peityInitOptions
    }
  }, [attributes, $chartElement, chartContainerElement])

  // update chart
  useLayoutEffect(() => {
    if ($chartElement && peityOptions.current) {
      const getFillOverride = () => (
        chartMetadata.chart_type === "line"
          ? window.NETDATA.themes.current.background
          : colorLuminance(orderedColors[0], window.NETDATA.chartDefaults.fill_luminance)
      )
      const updatedOptions = {
        ...peityOptions.current,
        stroke: orderedColors[0],
        // optimizatino from old dashboard, perhaps could be transformed to useMemo()
        fill: (orderedColors[0] === peityOptions.current.stroke)
          ? peityOptions.current.fill
          : getFillOverride(),
      }
      $chartElement.peity("line", updatedOptions)
      peityOptions.current = updatedOptions
    }
  }, [$chartElement, chartData, chartMetadata, orderedColors])

  return (
    <div
      ref={chartElement}
      id={chartElementId}
      className={chartElementClassName}
    >
      {chartData.result}
    </div>
  )
}
