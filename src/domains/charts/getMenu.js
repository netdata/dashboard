import { netdataDashboard } from "domains/dashboard/utils/netdata-dashboard"
import "@/src/dashboard_info"
import { name2id } from "utils/name-2-id"
import getChartMenu from "./getChartMenu"
import getChartHeads from "./getChartHeads"
import getMenuChartAttributes from "./getMenuChartAttributes"

export const getMenuInfo = (chartIds, getChart, { hasKubernetes, composite } = {}) => {
  const submenuNames = {}
  const chartMenus = {}
  const menuChartsAttributeById = {}
  const menuGroups = {}
  const menuGroupChartIds = {}
  const subMenus = {}

  chartIds.forEach(id => {
    const chart = getChart(id)
    if (!chart) return
    menuChartsAttributeById[id] = getMenuChartAttributes(chart)
    chartMenus[id] = getChartMenu(chart, submenuNames, { hasKubernetes, composite })
  })

  const sortedChartIds = [...chartIds].sort(
    (a, b) => chartMenus[a].priority - chartMenus[b].priority
  )

  sortedChartIds.forEach(id => {
    const menu = chartMenus[id]
    const subMenuId = `${menu.id}|${menu.subMenuId}`

    if (!subMenus[subMenuId]) subMenus[subMenuId] = []
    if (!menuGroups[menu.id]) menuGroups[menu.id] = new Set()
    if (!menuGroupChartIds[menu.id]) menuGroupChartIds[menu.id] = []

    subMenus[subMenuId].push(menu.chartId)
    menuGroups[menu.id].add(subMenuId)
    menuGroupChartIds[menu.id].push(menu.chartId)
    menuChartsAttributeById[id].menuGroupId = menu.id
  })

  return {
    chartMenus,
    menuChartsAttributeById,
    menuGroups,
    menuGroupChartIds,
    subMenus,
    submenuNames,
  }
}

export default (chartIds, getChart, { hasKubernetes, composite } = {}) => {
  const {
    chartMenus,
    menuChartsAttributeById,
    menuGroups,
    menuGroupChartIds,
    subMenus,
    submenuNames,
  } = getMenuInfo(chartIds, getChart, { hasKubernetes, composite })

  const menuGroupById = Object.keys(menuGroups).reduce((acc, menuId) => {
    const chartIds = menuGroupChartIds[menuId]
    const chartMenu = chartMenus[chartIds[0]]
    const firstChartId = chartIds.find(id => chartMenus[id].menuPattern)
    const menuPattern = firstChartId ? chartMenus[firstChartId].menuPattern : ""

    const subMenuIds = [...menuGroups[menuId]].sort((a, b) => {
      const chartMenu1 = chartMenus[subMenus[a][0]]
      const chartMenu2 = chartMenus[subMenus[b][0]]
      return (
        chartMenu1.priority - chartMenu2.priority ||
        a.localeCompare(b, undefined, { sensitivity: "accent" })
      )
    })

    const [attributes, headIds] = getChartHeads("mainheads", chartIds, getChart, {
      forceTimeWindow: true,
    })
    Object.assign(menuChartsAttributeById, attributes)

    acc[menuId] = {
      id: menuId,
      menuPattern,
      priority: chartMenu.priority,
      headIds: headIds,
      subMenuIds,
      subMenuChartIds: chartIds,
      title: netdataDashboard.menuTitle(chartMenu),
      icon: netdataDashboard.menuIcon(chartMenu),
      info: netdataDashboard.menuInfo(chartMenu),
      height: netdataDashboard.menuHeight(chartMenu) * 180,
      link: `${name2id(`menu_${menuId}`)}`,
      // link: `#${encodeURIComponent(menuId)}`, // will be used once we refactor the node-view rendering
    }

    return acc
  }, {})

  const subMenuById = Object.keys(subMenus).reduce((acc, subMenuId) => {
    const chartIds = subMenus[subMenuId].sort((a, b) => {
      const chart1 = getChart(a)
      const chart2 = getChart(b)
      return (
        chart1.priority - chart2.priority ||
        chart1.name.localeCompare(chart2.name, undefined, { sensitivity: "accent" })
      )
    })

    const chartMenu = chartMenus[chartIds[0]]
    const { id, menuPattern, height } = menuGroupById[chartMenu.id]

    const [attributes, headIds] = getChartHeads("heads", chartIds, getChart)
    Object.assign(menuChartsAttributeById, attributes)

    const menuKey = menuPattern || id

    const title =
      chartMenu.subMenuId in submenuNames
        ? `${chartMenu.subMenuId} (${submenuNames[chartMenu.subMenuId]})`
        : netdataDashboard.submenuTitle(menuKey, chartMenu.subMenuId)

    acc[subMenuId] = {
      id: subMenuId,
      menuGroupId: id,
      priority: chartMenu.priority,
      chartIds,
      headIds,
      title,
      info: netdataDashboard.submenuInfo(menuKey, chartMenu.subMenuId),
      height: netdataDashboard.submenuHeight(menuKey, chartMenu.subMenuId, height),
      link: `${name2id(`menu_${chartMenu.id}_submenu_${chartMenu.subMenuId}`)}`,
      // link: `#${encodeURIComponent(subMenuId)}`, // will be used once we refactor the node-view rendering
    }

    return acc
  }, {})

  const menuGroupIds = Object.keys(menuGroups).sort((a, b) => {
    const menuGroup1 = menuGroupById[a]
    const menuGroup2 = menuGroupById[b]
    return (
      menuGroup1.priority - menuGroup2.priority ||
      a.localeCompare(b, undefined, { sensitivity: "accent" })
    )
  })

  return { menuGroupIds, menuGroupById, subMenuById, menuChartsAttributeById }
}
