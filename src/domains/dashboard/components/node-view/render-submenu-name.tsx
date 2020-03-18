import React from "react"

import { name2id } from "utils/name-2-id"
import { Attributes } from "domains/chart/utils/transformDataAttributes"

import { prioritySort } from "../../utils/sorting"
import { parseChartString } from "../../utils/parse-chart-string"
import { netdataDashboard, options, Menu } from "../../utils/netdata-dashboard"
import { ChartWrapper } from "../chart-wrapper"


import { generateHeadCharts } from "./generate-head-charts"

const chartCommonMin = (family: string, context: string, units: string) => (
  netdataDashboard.anyAttribute(
    netdataDashboard.context, "commonMin", context, undefined,
  ) === undefined
    ? ""
    : `${family}/${context}/${units}`
)

const chartCommonMax = (family: string, context: string, units: string) => (
  netdataDashboard.anyAttribute(
    netdataDashboard.context, "commonMax", context, undefined,
  ) === undefined
    ? ""
    : `${family}/${context}/${units}`
)

interface RenderSubmenuNameArg {
  duration: number
  menu: Menu
  menuName: string
  pcentWidth: number
  host: string
}
export const renderSubmenuName = ({
  duration,
  menu,
  menuName,
  pcentWidth,
  host,
}: RenderSubmenuNameArg) => (submenuName: string) => {
  const submenuID = name2id(`menu_${menuName}_submenu_${submenuName}`)
  const submenu = menu.submenus[submenuName]
  const chartsSorted = submenu.charts
    .concat() // shallow clone
    .sort(prioritySort)
  const submenuInfo = submenu.info
  return (
    <div
      role="region"
      className="dashboard-section-container"
      id={submenuID}
      key={submenuName}
    >
      <h2 id={submenuID} className="netdata-chart-alignment">
        {submenu.title}
      </h2>
      {submenuInfo && (
        <div
          className="dashboard-submenu-info netdata-chart-alignment"
          role="document"
        >
          {submenuInfo}
        </div>
      )}
      <div className="netdata-chart-row">
        {chartsSorted
          .flatMap((chart) => generateHeadCharts("heads", chart, duration))
          .map(parseChartString)
          .map((attributes: Attributes | null) => attributes && (
            <ChartWrapper
              attributes={{ ...attributes, host }}
              key={`${attributes.id}-${attributes.dimensions}`}
            />
          ))}
      </div>
      {chartsSorted.map((chart) => {
        const commonMin = chartCommonMin(chart.family, chart.context, chart.units)
        const commonMax = chartCommonMax(chart.family, chart.context, chart.units)
        return (
          <div
            className="netdata-chartblock-container"
            style={{ width: `${pcentWidth}%` }}
            key={`${chart.id}-${chart.dimensions}`}
          >
            {/* eslint-disable-next-line react/no-danger */}
            <span dangerouslySetInnerHTML={{
              __html: netdataDashboard.contextInfo(chart.context),
            }}
            />
            <ChartWrapper
              id={`chart_${name2id(chart.id)}`}
              attributes={{
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
                before: 0,
                after: -duration,
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
              }}
            />
          </div>
        )
      })}
    </div>
  )
}
