import { useMenuChartAttributes } from "./context"
import { LEGEND_BOTTOM_SINGLE_LINE_HEIGHT } from "domains/chart/utils/legend-utils"

const selector = ({ height }) => height

export default (id, legendPosition) => {
  const height = useMenuChartAttributes(id, selector)

  return legendPosition === "bottom" ? height + LEGEND_BOTTOM_SINGLE_LINE_HEIGHT : height
}
