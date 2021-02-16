import { generateHeadCharts } from "@/src/domains/dashboard/components/node-view/generate-head-charts"
import { parseChartString } from "@/src/domains/dashboard/utils/parse-chart-string"

export default (type, chartIds, getChart) => {
  const charts = {}
  const ids = []
  chartIds
    .reduce(
      (acc, chartId) => [
        ...acc,
        ...generateHeadCharts(type, getChart(chartId), 0).map((head, index) => ({
          ...parseChartString(head),
          id: `${type}|${chartId}|${index}`,
        })),
      ],
      []
    )
    .forEach(chart => {
      charts[chart.id] = chart
      ids.push(chart.id)
    })

  return [charts, ids]
}
