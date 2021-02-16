import { generateHeadCharts } from "@/src/domains/dashboard/components/node-view/generate-head-charts"
import { parseChartString } from "@/src/domains/dashboard/utils/parse-chart-string"

export default (type, chartIds, getChart) => {
  const charts = {}
  const ids = []

  chartIds.forEach(chartId => {
    generateHeadCharts(type, getChart(chartId), 0).forEach((head, index) => {
      const id = `${type}|${chartId}|${index}`
      const chart = { ...parseChartString(head), id }
      charts[id] = chart
      ids.push(id)
    })
  })

  return [charts, ids]
}
