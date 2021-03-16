import { mapDefaultAggrMethod } from "utils/fill-missing-data"
import { generateHeadCharts } from "@/src/domains/dashboard/components/node-view/generate-head-charts"
import { parseChartString } from "@/src/domains/dashboard/utils/parse-chart-string"

export default (type, chartIds, getChart, attributes) => {
  const charts = {}
  const ids = []

  chartIds.forEach(chartId => {
    const chart = getChart(chartId)
    generateHeadCharts(type, chart, 0).forEach((head, index) => {
      if (!head) return

      const id = `${type}|${chartId}|${index}`
      const headChart = {
        id,
        chartId,
        aggrMethod: mapDefaultAggrMethod(chart.units),
        ...attributes,
      }

      const parsed = parseChartString(head)
      Object.keys(parsed).forEach(
        key => parsed[key] !== undefined && (headChart[key] = parsed[key])
      )

      charts[id] = headChart
      ids.push(id)
    })
  })

  return [charts, ids]
}
