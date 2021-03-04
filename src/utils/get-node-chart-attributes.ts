import { ChartsMetadata } from "domains/global/types"
import { renderChartsAndMenu } from "domains/dashboard/utils/render-charts-and-menu"
import {
  chartCommonMin, chartCommonMax,
} from "domains/dashboard/components/node-view/render-submenu-name"

import { prioritySort, sortObjectByPriority } from "domains/dashboard/utils/sorting"
import { netdataDashboard, options } from "domains/dashboard/utils/netdata-dashboard"
import { name2id } from "utils/name-2-id"
import { NODE_VIEW_DYGRAPH_TITLE_HEIGHT, DEFAULT_DASHBOARD_DURATION } from "./utils"

export const getNodeChartAttributes = (metadata: any, host: string) => {
  const menus = renderChartsAndMenu(metadata)
  const main = sortObjectByPriority(menus)

  // this mirrors quite closely node-view creation, it would be good to reuse it in node-view (todo)
  const sections = main.map((menuName) => {
    const menu = menus[menuName]
    const submenuNames = sortObjectByPriority(menu.submenus)
    return {
      sections: submenuNames.map((submenuName) => {
        const submenu = menu.submenus[submenuName]
        const chartsSorted = submenu.charts
          .concat() // shallow clone
          .sort(prioritySort)
        return {
          charts: chartsSorted.map((chart) => {
            const commonMin = chartCommonMin(chart.family, chart.context, chart.units)
            const commonMax = chartCommonMax(chart.family, chart.context, chart.units)
            return {
              host,
              id: chart.id,
              chartLibrary: "dygraph",
              width: "100%",
              height: netdataDashboard.contextHeight(
                chart.context, options.chartsHeight,
              ),
              dygraphValueRange: netdataDashboard.contextValueRange(
                chart.context,
              ),
              dygraphTitleHeight: NODE_VIEW_DYGRAPH_TITLE_HEIGHT,
              before: 0,
              after: -DEFAULT_DASHBOARD_DURATION,
              heightId: `${name2id(`${options.hostname}/${chart.id}`)}`,
              colors: `${netdataDashboard.anyAttribute(
                netdataDashboard.context, "colors", chart.context, "",
              )}`,
              decimalDigits: netdataDashboard.contextDecimalDigits(
                chart.context, -1,
              ),
              // add commonMin/commonMax attributes only if they are set
              ...(commonMin ? { commonMin } : {}),
              ...(commonMax ? { commonMax } : {}),
            }
          }),
          subsectionInfo: submenu.info,
          subsectionTitle: submenu.title,
        }
      }),
      sectionTitle: menu.title,
    }
  })
  return sections
}
