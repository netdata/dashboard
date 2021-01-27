import { clone } from "ramda"

import { ChartsMetadata } from "domains/global/types"
import { ChartMetadata, ChartEnriched } from "domains/chart/chart-types"
import { netdataDashboard, options } from "./netdata-dashboard"

// enrich the data structure returned by netdata
// to reflect our menu system and content
// TODO: this is a shame - we should fix charts naming (issue #807)
// ^^ (original comment from gsmox, still valid!)
function enrichChartData(chartName: string, chart: ChartMetadata, hasKubernetes: boolean) {
  const [type] = chartName.split(".") as string[]
  const parts = type.split("_")
  const tmp = parts[0]

  const chartEnriched = clone(chart) as ChartEnriched
  chartEnriched.menu = type

  switch (tmp) {
    case "ap":
    case "net":
    case "disk":
    case "powersupply":
    case "statsd":
      chartEnriched.menu = tmp
      break

    case "apache":
      if (parts.length > 2 && parts[1] === "cache") {
        chartEnriched.menu_pattern = `${tmp}_${parts[1]}`
      } else if (parts.length > 1) {
        chartEnriched.menu_pattern = tmp
      }
      break

    case "bind":
      if (parts.length > 2 && parts[1] === "rndc") {
        chartEnriched.menu_pattern = `${tmp}_${parts[1]}`
      } else if (parts.length > 1) {
        chartEnriched.menu_pattern = tmp
      }
      break

    case "cgroup":
      // eslint-disable-next-line camelcase
      if (hasKubernetes && chartEnriched.chartLabels?.k8s_cluster_id) {
        chartEnriched.menu = `kubernetes ${chartEnriched.chartLabels.k8s_cluster_id}`
      } else if (chartEnriched.id.match(/.*[._/-:]qemu[._/-:]*/)
        || chartEnriched.id.match(/.*[._/-:]kvm[._/-:]*/)
      ) {
        chartEnriched.menu_pattern = "cgqemu"
      } else if (parts.length === 1) {
        // composite-charts
        // override complex title generation in menuTitle()
        // We cannot change it in dashboard_info.js because it needs to be dynamic,
        // ie. when used for k8s dashboard-info.js' title should be still an empty string
        chartEnriched.sectionTitle = "cgroups"
        chartEnriched.menu_pattern = "cgroup"
      } else {
        chartEnriched.menu_pattern = "cgroup"
      }
      break

    case "go":
      if (parts.length > 2 && parts[1] === "expvar") {
        chartEnriched.menu_pattern = `${tmp}_${parts[1]}`
      } else if (parts.length > 1) {
        chartEnriched.menu_pattern = tmp
      }
      break

    case "isc":
      if (parts.length > 2 && parts[1] === "dhcpd") {
        chartEnriched.menu_pattern = `${tmp}_${parts[1]}`
      } else if (parts.length > 1) {
        chartEnriched.menu_pattern = tmp
      }
      break

    case "ovpn":
      if (parts.length > 3 && parts[1] === "status" && parts[2] === "log") {
        chartEnriched.menu_pattern = `${tmp}_${parts[1]}`
      } else if (parts.length > 1) {
        chartEnriched.menu_pattern = tmp
      }
      break

    case "smartd":
    case "web":
      if (parts.length > 2 && parts[1] === "log") {
        chartEnriched.menu_pattern = `${tmp}_${parts[1]}`
      } else if (parts.length > 1) {
        chartEnriched.menu_pattern = tmp
      }
      break

    case "tc":
      chartEnriched.menu = tmp

      // find a name for this device from fireqos info
      // we strip '_(in|out)' or '(in|out)_'
      if (chartEnriched.context === "tc.qos"
        && (typeof options.submenu_names[chartEnriched.family] === "undefined"
          || options.submenu_names[chartEnriched.family] === chartEnriched.family
        )
      ) {
        const n = chartEnriched.name.split(".")[1]
        if (n.endsWith("_in")) {
          options.submenu_names[chartEnriched.family] = n.slice(0, n.lastIndexOf("_in"))
        } else if (n.endsWith("_out")) {
          options.submenu_names[chartEnriched.family] = n.slice(0, n.lastIndexOf("_out"))
        } else if (n.startsWith("in_")) {
          options.submenu_names[chartEnriched.family] = n.slice(3, n.length)
        } else if (n.startsWith("out_")) {
          options.submenu_names[chartEnriched.family] = n.slice(4, n.length)
        } else {
          options.submenu_names[chartEnriched.family] = n
        }
      }

      // increase the priority of IFB devices
      // to have inbound appear before outbound
      if (chartEnriched.id.match(/.*-ifb$/)) {
        chartEnriched.priority -= 1
      }

      break

    default:
      if (parts.length > 1) {
        chartEnriched.menu_pattern = tmp
      }
      break
  }

  chartEnriched.submenu = chartEnriched.family || "all"
  return chartEnriched
}

export const renderChartsAndMenu = (
  data: ChartsMetadata,
  fullMetadata?: ChartsMetadata,
  hasKubernetes?: boolean,
) => {
  options.menus = {}
  options.submenu_names = {}

  const { menus } = options
  const { charts } = data

  Object.keys(charts).forEach((chartName: string) => {
    // @ts-ignore
    const chart = enrichChartData(chartName, charts[chartName] as ChartEnriched, hasKubernetes)
    const m = chart.menu

    // create the menu
    // j: when multiple charts have the same menu (type in /charts response)
    // j: then we set the smallest priority from them
    if (typeof menus[m] === "undefined") {
      menus[m] = {
        menu_pattern: chart.menu_pattern,
        priority: chart.priority,
        submenus: {},
        title: netdataDashboard.menuTitle(chart),
        icon: netdataDashboard.menuIcon(chart),
        info: netdataDashboard.menuInfo(chart),
        height: netdataDashboard.menuHeight(chart) * options.chartsHeight,
      }
    } else {
      if (typeof (menus[m].menu_pattern) === "undefined") {
        menus[m].menu_pattern = chart.menu_pattern
      }

      if (chart.priority < menus[m].priority) {
        menus[m].priority = chart.priority
      }
      if (fullMetadata) {
        if (!menus[m].correlationsMetadata) {
          menus[m].correlationsMetadata = { scoredCount: 1, totalCount: 1, averageScore: 0 }
        }
        menus[m].correlationsMetadata!.scoredCount = menus[m].correlationsMetadata!.scoredCount!
          + 1 // Object.keys(chart.dimensions).length
      }
    }

    const menuKey = (typeof (menus[m].menu_pattern) !== "undefined") ? menus[m].menu_pattern : m

    // create the submenu
    if (typeof menus[m].submenus[chart.submenu] === "undefined") {
      menus[m].submenus[chart.submenu] = {
        priority: chart.priority,
        charts: [],
        title: null,
        info: netdataDashboard.submenuInfo(menuKey, chart.submenu),
        height: netdataDashboard.submenuHeight(menuKey, chart.submenu, menus[m].height),
      }
    } else if (chart.priority < menus[m].submenus[chart.submenu].priority) {
      menus[m].submenus[chart.submenu].priority = chart.priority
    }

    // index the chart in the menu/submenu
    menus[m].submenus[chart.submenu].charts.push(chart)
  })

  if (fullMetadata) {
    const correlationCharts = fullMetadata.charts
    Object.keys(correlationCharts).forEach((chartName: string) => {
      const chart = enrichChartData(
        chartName,
        correlationCharts[chartName] as ChartEnriched,
        // @ts-ignore
        hasKubernetes,
      )
      const m = chart.menu
      if (!menus[m]) {
        return
      }
      if (!menus[m].correlationsMetadata) {
        menus[m].correlationsMetadata = { scoredCount: 1, totalCount: 1, averageScore: 0 }
      }
      menus[m].correlationsMetadata!.totalCount = menus[m].correlationsMetadata!.totalCount!
        + 1 // Object.keys(chart.dimensions).length
    })
  }

  // propagate the descriptive subname given to QoS
  // to all the other submenus with the same name
  Object.keys(menus).forEach((m) => {
    Object.keys(menus[m].submenus).forEach((s) => {
      // set the family using a name
      if (typeof options.submenu_names[s] !== "undefined") {
        menus[m].submenus[s].title = `${s} (${options.submenu_names[s]})`
      } else {
        const menuKey = (typeof (menus[m].menu_pattern) !== "undefined") ? menus[m].menu_pattern : m
        menus[m].submenus[s].title = netdataDashboard.submenuTitle(menuKey, s)
      }
    })
  })

  return menus
}
