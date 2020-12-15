import { ChartMetadata } from "domains/chart/chart-types"

export default (metadata: ChartMetadata) => {
  // @ts-ignore
  return Object.keys(metadata.chartLabels).some((label) => label.startsWith("k8s"))
}
