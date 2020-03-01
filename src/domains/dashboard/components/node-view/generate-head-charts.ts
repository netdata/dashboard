import { ChartMetadata } from "domains/chart/chart-types"

import { netdataDashboard } from "../../utils/netdata-dashboard"

type HeadDescription = ((os: string, id: string) => string) | string

export const generateHeadCharts = (type: string, chart: ChartMetadata, duration: number) => {
  // todo don't add head charts on print view
  // if (urlOptions.mode === 'print') {
  //   return '';
  // }

  const hcharts = netdataDashboard.anyAttribute(netdataDashboard.context, type, chart.context, [])
  return hcharts.map((hChart: HeadDescription) => (typeof hChart === "function"
    ? hChart(netdataDashboard.os, chart.id)
      .replace(/CHART_DURATION/g, duration.toString())
      .replace(/CHART_UNIQUE_ID/g, chart.id)
    : hChart.replace(/CHART_DURATION/g, duration.toString())
      .replace(/CHART_UNIQUE_ID/g, chart.id)
  ))
}
