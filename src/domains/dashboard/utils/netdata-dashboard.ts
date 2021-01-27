/* eslint-disable max-len */
import { ChartsMetadata } from "domains/global/types"
import { AnyStringKeyT } from "types/common"
import { ChartEnriched } from "domains/chart/chart-types"

export interface Submenus {
  [submenus: string]: {
    charts: ChartEnriched[]
    height: number
    info: string | null
    priority: number
    title: string | null
  }
}

export interface CorrelationMetadata {
    scoredCount?: number
    totalCount?: number
    averageScore?: number
}

export interface Menu {
  // eslint-disable-next-line camelcase
  menu_pattern: string
  priority: number
  submenus: Submenus
  title: string
  icon: string
  info: string
  height: number
  correlationsMetadata?: CorrelationMetadata
}

export interface Menus {
  [menu: string]: Menu
}

export const options = {
  menus: {} as Menus,
  submenu_names: {} as {[family: string]: string},
  data: null as (ChartsMetadata | null),
  hostname: "netdata_server", // will be overwritten by the netdata server
  version: "unknown",
  release_channel: "unknown",
  hosts: [],

  duration: 0, // the default duration of the charts
  update_every: 1,

  chartsPerRow: 0,
  // chartsMinWidth: 1450,
  chartsHeight: 180,
}


// netdata standard information
export const netdataDashboard = {
  sparklines_registry: {} as {[key: string]: { count: number }},
  os: "unknown",

  menu: {},
  submenu: {} as {
    [family: string]: {
      info?: string | ((os: string) => string)
      title?: string
    }
  },
  context: {} as {
    [id: string]: {
      valueRange: string // examples: "[0, 100]", "[null, null]"
      height: number
      decimalDigits: number
  }},

  // generate a sparkline
  // used in the documentation
  sparkline(
    prefix: string, chart: string, dimension: string, units: string = "", suffix: string,
  ) {
    if (options.data === null || typeof options.data.charts === "undefined") {
      return ""
    }

    if (typeof options.data.charts[chart] === "undefined") {
      return ""
    }

    if (typeof options.data.charts[chart].dimensions === "undefined") {
      return ""
    }

    if (typeof options.data.charts[chart].dimensions[dimension] === "undefined") {
      return ""
    }

    let key = `${chart}.${dimension}`

    if (typeof this.sparklines_registry[key] === "undefined") {
      this.sparklines_registry[key] = { count: 1 }
    } else {
      this.sparklines_registry[key].count += 1
    }

    key = `${key}.${this.sparklines_registry[key].count}`

    return `${prefix}<div class="netdata-container" data-netdata="${chart}" data-after="-120"
      data-width="25%" data-height="15px" data-chart-library="dygraph"
      data-dygraph-theme="sparkline" data-dimensions="${dimension}"
      data-show-value-of-${dimension}-at="${key}"></div>
       (<span id="${key}" style="display: inline-block; min-width: 50px; text-align: right;">
       X</span>${units})${suffix}`
  },

  gaugeChart(
    title: string, width: string, dimensions: string = "", colors: string = "",
  ) {
    return `${"<div class=\"netdata-container\" data-netdata=\"CHART_UNIQUE_ID\""
      + " data-dimensions=\""}${dimensions}"`
      + " data-chart-library=\"gauge\""
      + " data-gauge-adjust=\"width\""
      + ` data-title="${title}"`
      + ` data-width="${width}"`
      + " data-before=\"0\""
      + " data-after=\"-CHART_DURATION\""
      + " data-points=\"CHART_DURATION\""
      + ` data-colors="${colors}"`
      + " role=\"application\"></div>"
  },

  anyAttribute(obj: AnyStringKeyT, attr: string, key: string, def: unknown) {
    if (typeof (obj[key]) !== "undefined") {
      const x = obj[key][attr]

      if (typeof (x) === "undefined") {
        return def
      }

      if (typeof (x) === "function") {
        return x(netdataDashboard.os)
      }

      return x
    }

    return def
  },

  menuTitle(chart: ChartEnriched) {
    if (chart.sectionTitle) {
      return chart.sectionTitle
    }
    if (typeof chart.menu_pattern !== "undefined") {
      const type = chart.type || chart.id.split(".")[0]
      return (`${this.anyAttribute(this.menu, "title", chart.menu_pattern, chart.menu_pattern)
        .toString()
      } ${type.slice(-(type.length - chart.menu_pattern.length - 1)).toString()}`)
        .replace(/_/g, " ")
    }

    return (this.anyAttribute(this.menu, "title", chart.menu, chart.menu)).toString()
      .replace(/_/g, " ")
  },

  menuIcon(chart: ChartEnriched) {
    if (typeof chart.menu_pattern !== "undefined") {
      return this.anyAttribute(this.menu, "icon", chart.menu_pattern,
        "<i class=\"fas fa-puzzle-piece\"></i>").toString()
    }

    return this.anyAttribute(this.menu, "icon", chart.menu, "<i class=\"fas fa-puzzle-piece\"></i>")
  },

  menuInfo(chart: ChartEnriched) {
    if (typeof chart.menu_pattern !== "undefined") {
      return this.anyAttribute(this.menu, "info", chart.menu_pattern, null)
    }

    return this.anyAttribute(this.menu, "info", chart.menu, null)
  },

  menuHeight(chart: ChartEnriched) {
    if (typeof chart.menu_pattern !== "undefined") {
      return this.anyAttribute(this.menu, "height", chart.menu_pattern, 1.0)
    }

    return this.anyAttribute(this.menu, "height", chart.menu, 1.0)
  },

  submenuTitle(menu: string, submenu: string) {
    const key = `${menu}.${submenu}`
    // console.log(key);
    const title = this.anyAttribute(this.submenu, "title", key, submenu)
      .toString().replace(/_/g, " ") as string
    if (title.length > 28) {
      const a = title.substring(0, 13)
      const b = title.substring(title.length - 12, title.length)
      return `${a}...${b}`
    }
    return title
  },

  submenuInfo(menu: string, submenu: string) {
    const key = `${menu}.${submenu}`
    return this.anyAttribute(this.submenu, "info", key, null) as (string | null)
  },

  submenuHeight(menu: string, submenu: string, relative: number) {
    const key = `${menu}.${submenu}`
    return this.anyAttribute(this.submenu, "height", key, 1.0) * relative
  },

  contextInfo(id: string) {
    const x = this.anyAttribute(this.context, "info", id, null)

    if (x !== null) {
      return `<div class="shorten dashboard-context-info"
        role="document">${x}</div>`
    }
    return ""
  },

  contextValueRange(id: string) {
    if (typeof this.context[id] !== "undefined"
      && typeof this.context[id].valueRange !== "undefined"
    ) {
      try {
        return JSON.parse(this.context[id].valueRange)
      } catch (e) {
        return [null, null]
      }
    }
    return [null, null]
  },

  contextHeight(id: string, def: number) {
    if (typeof this.context[id] !== "undefined" && typeof this.context[id].height !== "undefined") {
      return def * this.context[id].height
    }
    return def
  },

  contextDecimalDigits(id: string, def: number) {
    if (typeof this.context[id] !== "undefined"
      && typeof this.context[id].decimalDigits !== "undefined"
    ) {
      return this.context[id].decimalDigits
    }
    return def
  },
}

// @ts-ignore
window.netdataDashboard = netdataDashboard
