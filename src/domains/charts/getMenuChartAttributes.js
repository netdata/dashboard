import { netdataDashboard, options } from "domains/dashboard/utils/netdata-dashboard"
import { name2id } from "utils/name-2-id"

export const getChartCommon = ({ family, context, units }, type) =>
  netdataDashboard.anyAttribute(netdataDashboard.context, type, context, undefined) === undefined
    ? ""
    : `${family}/${context}/${units}`

export default chart => {
  const { context, id } = chart
  const commonMin = getChartCommon(chart, "commonMin")
  const commonMax = getChartCommon(chart, "commonMax")

  return {
    id,
    chartId: id,
    link: `chart_${name2id(id)}`,
    chartLibrary: "dygraph",
    width: "100%",
    forceTimeWindow: true,
    info: netdataDashboard.contextInfo(context),
    height: netdataDashboard.contextHeight(context, options.chartsHeight),
    dygraphValueRange: netdataDashboard.contextValueRange(context),
    heightId: `${name2id(`${options.hostname}/${id}`)}`,
    colors: `${netdataDashboard.anyAttribute(netdataDashboard.context, "colors", context, "")}`,
    decimalDigits: netdataDashboard.contextDecimalDigits(context, -1),
    dygraphTitle: "",
    dygraphTitleHeight: 0,
    ...(commonMin && { commonMin }),
    ...(commonMax && { commonMax }),
  }
}
