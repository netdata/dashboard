import { Attributes } from "./transformDataAttributes"
import { ChartLibraryConfig } from "./chartLibrariesSettings"

type GetChartPixelsPerPoint = (arg: {
  attributes: Attributes,
  chartSettings: ChartLibraryConfig,
}) => number

export const getChartPixelsPerPoint: GetChartPixelsPerPoint = ({
  attributes, chartSettings,
}) => {
  const {
    pixelsPerPoint: pixelsPerPointAttribute,
  } = attributes
  if (typeof pixelsPerPointAttribute === "number") {
    return pixelsPerPointAttribute
  }
  const pixelsPerPointSetting = chartSettings.pixelsPerPoint(attributes)

  return Math.max(...[
    pixelsPerPointSetting,
    window.NETDATA.options.current.pixels_per_point,
  ].filter((px) => typeof px === "number"))
}
