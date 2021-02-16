import { netdataDashboard } from "domains/dashboard/utils/netdata-dashboard"
import "@/src/dashboard_info"
import { name2id } from "utils/name-2-id"
import getChartMenu from "./getChartMenu"
import getChartHeads from "./getChartHeads"

export default (chartIds, getChart) => {
  const submenuNames = {}

  const chartMenus = chartIds.reduce((acc, id) => {
    acc[id] = getChartMenu(getChart(id), submenuNames)
    return acc
  }, {})

  const sortedChartIds = [...chartIds].sort(
    (a, b) => chartMenus[a].priority - chartMenus[b].priority
  )

  const charts = {}
  const menuGroups = {}
  const menuGroupCharts = {}
  const subMenus = {}

  sortedChartIds.forEach(id => {
    const menu = chartMenus[id]
    const subMenuId = `${menu.id}|${menu.subMenuId}`

    if (!subMenus[subMenuId]) subMenus[subMenuId] = []
    if (!menuGroups[menu.id]) menuGroups[menu.id] = new Set()
    if (!menuGroupCharts[menu.id]) menuGroupCharts[menu.id] = []

    subMenus[subMenuId].push(menu.chartId)
    menuGroups[menu.id].add(subMenuId)
    menuGroupCharts[menu.id].push(menu.chartId)
  })

  const menuGroupsCollection = Object.keys(menuGroups).reduce((acc, menuId) => {
    const chartIds = menuGroupCharts[menuId]
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

    const [headCharts, headIds] = getChartHeads("mainheads", chartIds, getChart)
    Object.assign(charts, headCharts)

    acc[menuId] = {
      menuPattern,
      priority: chartMenu.priority,
      headIds: headIds,
      subMenuIds,
      title: netdataDashboard.menuTitle(chartMenu),
      icon: netdataDashboard.menuIcon(chartMenu),
      info: netdataDashboard.menuInfo(chartMenu),
      height: netdataDashboard.menuHeight(chartMenu) * 180,
      link: `#${name2id(`menu_${menuId}`)}`,
      // link: `#${encodeURIComponent(menuId)}`, // will be used once we refactor the node-view rendering
    }

    return acc
  }, {})

  const subMenusCollection = Object.keys(subMenus).reduce((acc, subMenuId) => {
    const chartIds = subMenus[subMenuId].sort((a, b) => {
      const chart1 = getChart(a)
      const chart2 = getChart(b)
      return (
        chart1.priority - chart2.priority ||
        chart1.name.localeCompare(chart2.name, undefined, { sensitivity: "accent" })
      )
    })

    const chartMenu = chartMenus[chartIds[0]]
    const { id, menuPattern, height } = menuGroupsCollection[chartMenu.id]

    const [headCharts, headIds] = getChartHeads("heads", chartIds, getChart)
    Object.assign(charts, headCharts)

    const menuKey = menuPattern || id

    const title =
      chartMenu.subMenuId in submenuNames
        ? `${chartMenu.subMenuId} (${submenuNames[chartMenu.subMenuId]})`
        : netdataDashboard.submenuTitle(menuKey, chartMenu.subMenuId)

    acc[subMenuId] = {
      priority: chartMenu.priority,
      chartIds,
      headIds,
      title,
      info: netdataDashboard.submenuInfo(menuKey, chartMenu.subMenuId),
      height: netdataDashboard.submenuHeight(menuKey, chartMenu.subMenuId, height),
      chartSubMenuId: chartMenu.subMenuId,
      link: `#${name2id(`menu_${chartMenu.id}_submenu_${chartMenu.subMenuId}`)}`,
      // link: `#${encodeURIComponent(subMenuId)}`, // will be used once we refactor the node-view rendering
    }

    return acc
  }, {})

  const menusCollection = Object.keys(menuGroups).sort((a, b) => {
    const menuGroup1 = menuGroupsCollection[a]
    const menuGroup2 = menuGroupsCollection[b]
    return (
      menuGroup1.priority - menuGroup2.priority ||
      a.localeCompare(b, undefined, { sensitivity: "accent" })
    )
  })

  return { menusCollection, menuGroupsCollection, subMenusCollection, charts }
}
