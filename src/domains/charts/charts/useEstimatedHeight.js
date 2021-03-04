import { useChartAttributes, useMenuChartAttributes } from "./context"
import { LEGEND_BOTTOM_SINGLE_LINE_HEIGHT } from "domains/chart/utils/legend-utils"

const selector = ({ height, chartId }) => ({ height, chartId })
const legendPositionSelector = ({ legendPosition }) => legendPosition

export default id => {
  const { height, chartId } = useMenuChartAttributes(id, selector)
  const legendPosition = useChartAttributes(chartId, legendPositionSelector)

  return legendPosition === "bottom" ? height + LEGEND_BOTTOM_SINGLE_LINE_HEIGHT : height
}
