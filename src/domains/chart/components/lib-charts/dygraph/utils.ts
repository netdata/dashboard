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
