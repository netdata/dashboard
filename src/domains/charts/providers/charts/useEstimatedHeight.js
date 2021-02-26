import { useChartAttributes, useMenuChartAttributes } from "./context"
import { LEGEND_BOTTOM_SINGLE_LINE_HEIGHT } from "domains/chart/utils/legend-utils"

export default id => {
  const { height, chartId } = useMenuChartAttributes(id)
  const legendPosition = useChartAttributes(chartId, "legendPosition")

  return legendPosition === "bottom" ? height + LEGEND_BOTTOM_SINGLE_LINE_HEIGHT : height
}
