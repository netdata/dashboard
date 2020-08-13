/* eslint-disable no-nested-ternary */
import { always, memoizeWith } from "ramda"
import Color from "color"

import { ChartMetadata, DygraphData } from "domains/chart/chart-types"
import { Attributes } from "domains/chart/utils/transformDataAttributes"
import { ChartLibraryConfig } from "domains/chart/utils/chartLibrariesSettings"

export const getDataForFakeStacked = (
  data: number[][],
  dimensionsVisibility: boolean[],
): number[][] => data.map((point) => {
  const [timestamp, ...values] = point
  const rest: number[] = []
  let currentMin = 0
  let currentMax = 0
  values
    .map((value, i) => ({ isVisible: dimensionsVisibility[i], value }))
    // reverse because first dimensions should be "on top" (at least positive ones)
    .slice().reverse()
    .forEach(({ isVisible, value }) => {
      if (!isVisible) {
        rest.push(0) // push with value '0'. it won't be visible but needs to be present in array
        return
      }
      if (value >= 0) {
        currentMax += value
        rest.push(currentMax)
      } else {
        currentMin += value
        rest.push(currentMin)
      }
    })
  return [
    timestamp,
    ...rest,
  ]
})

export const getDygraphChartType = (
  attributes: Attributes, chartData: DygraphData, chartMetadata: ChartMetadata,
  chartSettings: ChartLibraryConfig,
) => {
  const isLogScale = (chartSettings.isLogScale as ((a: Attributes) => boolean))(attributes)
  const {
    dygraphType: dygraphRequestedType = chartMetadata.chart_type,
  } = attributes
  // corresponds to state.tmp.dygraph_chart_type in old app
  let dygraphChartType = dygraphRequestedType
  if (dygraphChartType === "stacked" && chartData.dimensions === 1) {
    dygraphChartType = "area"
  }
  if (dygraphChartType === "stacked" && isLogScale) {
    dygraphChartType = "area"
  }
  return dygraphChartType
}

const getBackgroundColor = memoizeWith(
  always("true"),
  () => Color(window.NETDATA.themes.current.background),
)
// when in "fakeStacked" mode, we cannot use opacity for fill in charts, because the areas would
// be visible under each other. So the darkening / whitening needs to be added directly to colors
// (the colors are too saturated for areas and in stacked mode they were with 0.8 opacity)
export const transformColors = (colors: string[]) => (
  colors.map((color) => Color(color).mix(getBackgroundColor(), 0.2).hex())
)

export const getDygraphFillAlpha = (
  isFakeStacked: boolean, dygraphChartType: string,
) => (isFakeStacked
  ? window.NETDATA.options.current.color_fill_opacity_fake_stacked
  : dygraphChartType === "stacked"
    ? window.NETDATA.options.current.color_fill_opacity_stacked
    : window.NETDATA.options.current.color_fill_opacity_area)
