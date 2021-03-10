import Description from "domains/charts/description"
import { withMenuChartAttributes } from "./context"

export const ChartDescriptionContainer = withMenuChartAttributes(Description, ({ info }) => ({
  children: info,
}))
