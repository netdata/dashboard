import { generateHeadCharts } from "@/src/domains/dashboard/components/node-view/generate-head-charts"
import { parseChartString } from "@/src/domains/dashboard/utils/parse-chart-string"

export default (type, chartIds, getChart, attributes) => {
  const charts = {}
  const ids = []

  chartIds.forEach(chartId => {
    generateHeadCharts(type, getChart(chartId), 0).forEach((head, index) => {
      if (!head) return

      const id = `${type}|${chartId}|${index}`
      const chart = { id, chartId, ...attributes }

      const parsed = parseChartString(head)
      Object.keys(parsed).forEach(key => parsed[key] !== undefined && (chart[key] = parsed[key]))

      charts[id] = chart
      ids.push(id)
    })
  })

  return [charts, ids]
}
