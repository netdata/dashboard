import "jquery-sparkline"
import React, {
  useRef, useEffect, useState,
} from "react"

import { Attributes } from "domains/chart/utils/transformDataAttributes"
import { ChartMetadata, EasyPieChartData } from "domains/chart/chart-types"
import { colorLuminance } from "domains/chart/utils/color-luminance"
import { MS_IN_SECOND } from "utils"
import { TimeRange } from "types/common"

const convertToTimestamp = (number: number) => {
  if (number > 0) {
    return number
  }
  return new Date().valueOf() + number // number is negative or zero
}

interface TimeWindowCorrection {
  paddingLeftPercentage?: string
  widthRatio?: number
}
const getForceTimeWindowCorrection = (
  chartData: EasyPieChartData, requestedViewRange: TimeRange,
): TimeWindowCorrection => {
  const requestedAfter = convertToTimestamp(requestedViewRange[0])
  const requestedBefore = convertToTimestamp(requestedViewRange[1])
  const after = chartData.after * MS_IN_SECOND
  const before = chartData.before * MS_IN_SECOND

  const currentDuration = before - after
  const requestedDuration = requestedBefore - requestedAfter
  // don't do overrides when current (available) duration is bigger or only slightly lower
  // than requested duration
  const DURATION_CHANGE_TOLERANCE = 1.03
  if (currentDuration > requestedDuration / DURATION_CHANGE_TOLERANCE) {
    return {}
  }

  const widthRatio = currentDuration / requestedDuration

  const visibleDuration = requestedBefore - requestedAfter
  const paddingLeftPercentage = `${100 * ((after - requestedAfter) / visibleDuration)}%`

  return {
    paddingLeftPercentage,
    widthRatio,
  }
}

interface Props {
  attributes: Attributes
  chartContainerElement: HTMLElement
  chartData: EasyPieChartData
  chartMetadata: ChartMetadata
  chartElementClassName: string
  chartElementId: string
  dimensionsVisibility: boolean[]
  isRemotelyControlled: boolean
  orderedColors: string[]
  unitsCurrent: string
  requestedViewRange: TimeRange
}
export const SparklineChart = ({
  attributes,
  chartContainerElement,
  chartData,
  chartMetadata,
  chartElementClassName,
  chartElementId,
  orderedColors,
  unitsCurrent,
  requestedViewRange,
}: Props) => {
  const chartElement = useRef<HTMLDivElement>(null)

  // update width, height automatically each time
  const [$chartElement, set$chartElement] = useState()
  const sparklineOptions = useRef<{[key: string]: any}>()

  const { paddingLeftPercentage = undefined, widthRatio = 1 } = attributes.forceTimeWindow
    ? getForceTimeWindowCorrection(chartData, requestedViewRange)
    : {}

  // create chart
  useEffect(() => {
    if (chartElement.current && !$chartElement) {
      const $element = window.$(chartElement.current)
      const { width, height } = chartContainerElement.getBoundingClientRect()
      const {
        sparklineLineColor = orderedColors[0],
      } = attributes
      const defaultFillColor = chartMetadata.chart_type === "line"
        ? window.NETDATA.themes.current.background
        : colorLuminance(sparklineLineColor, window.NETDATA.chartDefaults.fill_luminance)
      const {
        sparklineType = "line",
        sparklineFillColor = defaultFillColor,
        sparklineDisableInteraction = false,
        sparklineDisableTooltips = false,
        sparklineDisableHighlight = false,
        sparklineHighlightLighten = 1.4,
        sparklineTooltipSuffix = ` ${unitsCurrent}`,
        sparklineNumberFormatter = (n: number) => n.toFixed(2),
      } = attributes
      const chartTitle = attributes.title || chartMetadata.title

      const emptyStringIfDisable = (x: string | undefined) => (x === "disable" ? "" : x)
      const sparklineInitOptions = {
        type: sparklineType,
        lineColor: sparklineLineColor,
        fillColor: sparklineFillColor,
        chartRangeMin: attributes.sparklineChartRangeMin,
        chartRangeMax: attributes.sparklineChartRangeMax,
        composite: attributes.sparklineComposite,
        enableTagOptions: attributes.sparklineEnableTagOptions,
        tagOptionPrefix: attributes.sparklineTagOptionPrefix,
        tagValuesAttribute: attributes.sparklineTagValuesAttribute,

        disableHiddenCheck: attributes.sparklineDisableHiddenCheck,
        defaultPixelsPerValue: attributes.sparklineDefaultPixelsPerValue,
        spotColor: emptyStringIfDisable(attributes.sparklineSpotColor),
        minSpotColor: emptyStringIfDisable(attributes.sparklineMinSpotColor),
        maxSpotColor: emptyStringIfDisable(attributes.sparklineMaxSpotColor),
        spotRadius: attributes.sparklineSpotRadius,
        valueSpots: attributes.sparklineValueSpots,
        highlightSpotColor: attributes.sparklineHighlightSpotColor,
        highlightLineColor: attributes.sparklineHighlightLineColor,
        lineWidth: attributes.sparklineLineWidth,
        normalRangeMin: attributes.sparklineNormalRangeMin,
        normalRangeMax: attributes.sparklineNormalRangeMax,
        drawNormalOnTop: attributes.sparklineDrawNormalOnTop,
        xvalues: attributes.sparklineXvalues,
        chartRangeClip: attributes.sparklineChartRangeClip,
        chartRangeMinX: attributes.sparklineChartRangeMinX,
        chartRangeMaxX: attributes.sparklineChartRangeMaxX,
        disableInteraction: sparklineDisableInteraction,
        disableTooltips: sparklineDisableTooltips,
        disableHighlight: sparklineDisableHighlight,
        highlightLighten: sparklineHighlightLighten,
        highlightColor: attributes.sparklineHighlightColor,
        tooltipContainer: attributes.sparklineTooltipContainer,
        tooltipClassname: attributes.sparklineTooltipClassname,
        tooltipChartTitle: chartTitle,
        tooltipFormat: attributes.sparklineTooltipFormat,
        tooltipPrefix: attributes.sparklineTooltipPrefix,
        tooltipSuffix: sparklineTooltipSuffix,
        tooltipSkipNull: attributes.sparklineTooltipSkipNull,
        tooltipValueLookups: attributes.sparklineTooltipValueLookups,
        tooltipFormatFieldlist: attributes.sparklineTooltipFormatFieldlist,
        tooltipFormatFieldlistKey: attributes.sparklineTooltipFormatFieldlistKey,
        numberFormatter: sparklineNumberFormatter,
        numberDigitGroupSep: attributes.sparklineNumberDigitGroupSep,
        numberDecimalMark: attributes.sparklineNumberDecimalMark,
        numberDigitGroupCount: attributes.sparklineNumberDigitGroupCount,
        animatedZooms: attributes.sparklineAnimatedZooms,
        width: Math.floor(width * widthRatio),
        height: Math.floor(height),
      }

      set$chartElement(() => $element)
      sparklineOptions.current = sparklineInitOptions
      // @ts-ignore
      $element.sparkline(chartData.result, sparklineInitOptions)
    }
  }, [$chartElement, attributes, chartContainerElement, chartData.result, chartMetadata,
    orderedColors, unitsCurrent, widthRatio])

  // update chart
  useEffect(() => {
    if ($chartElement) {
      const { width, height } = chartContainerElement.getBoundingClientRect()
      $chartElement.sparkline(chartData.result, {
        ...sparklineOptions.current,
        width: Math.floor(width * widthRatio),
        height: Math.floor(height),
      })
    }
  })

  const style = paddingLeftPercentage ? {
    textAlign: "initial" as "initial", // :) typescript
    paddingLeft: paddingLeftPercentage,
  } : undefined

  return (
    <div ref={chartElement} id={chartElementId} className={chartElementClassName} style={style} />
  )
}
