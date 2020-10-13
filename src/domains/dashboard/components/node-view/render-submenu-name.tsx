import React from "react"

import { name2id } from "utils/name-2-id"
import { Attributes, ChartsAttributes } from "domains/chart/utils/transformDataAttributes"
import { DropdownMenu } from "domains/chart/components/chart-dropdown"
import { RenderCustomElementForDygraph } from "domains/chart/components/chart-with-loader"
import { LEGEND_BOTTOM_SINGLE_LINE_HEIGHT } from "domains/chart/utils/legend-utils"
import { ChartsMetadata } from "domains/global/types"
import { NODE_VIEW_DYGRAPH_TITLE_HEIGHT } from "utils"

import { prioritySort } from "../../utils/sorting"
import { parseChartString } from "../../utils/parse-chart-string"
import { netdataDashboard, options, Menu } from "../../utils/netdata-dashboard"
import { ChartWrapper } from "../chart-wrapper"


import { generateHeadCharts } from "./generate-head-charts"

export const chartCommonMin = (family: string, context: string, units: string) => (
  netdataDashboard.anyAttribute(
    netdataDashboard.context, "commonMin", context, undefined,
  ) === undefined
    ? ""
    : `${family}/${context}/${units}`
)

export const chartCommonMax = (family: string, context: string, units: string) => (
  netdataDashboard.anyAttribute(
    netdataDashboard.context, "commonMax", context, undefined,
  ) === undefined
    ? ""
    : `${family}/${context}/${units}`
)

interface RenderSubmenuNameArg {
  chartsMetadata: ChartsMetadata
  duration: number
  dropdownMenu?: DropdownMenu
  host: string
  menu: Menu
  menuName: string
  pcentWidth: number
  renderCustomElementForDygraph?: RenderCustomElementForDygraph
  attributesOverrides?: ChartsAttributes
  nodeIDs: string[]
  commonAttributesOverrides?: Partial<Attributes>
}
export const renderSubmenuName = ({
  chartsMetadata,
  dropdownMenu,
  duration,
  host,
  menu,
  menuName,
  pcentWidth,
  renderCustomElementForDygraph,
  attributesOverrides,
  nodeIDs,
  commonAttributesOverrides,
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
      <h2 id={submenuID}>
        {submenu.title}
      </h2>
      {submenuInfo && (
        <div
          className="dashboard-submenu-info"
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
              attributes={{ ...attributes, host, nodeIDs }}
              key={`${attributes.id}-${attributes.dimensions}`}
              chartMetadata={chartsMetadata.charts[attributes.id]}
            />
          ))}
      </div>
      {chartsSorted.map((chart) => {
        const commonMin = chartCommonMin(chart.family, chart.context, chart.units)
        const commonMax = chartCommonMax(chart.family, chart.context, chart.units)
        const chartAdditionalHeight = commonAttributesOverrides?.legendPosition === "bottom"
          ? LEGEND_BOTTOM_SINGLE_LINE_HEIGHT
          : 0
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
                ) + chartAdditionalHeight,
                dygraphValueRange: netdataDashboard.contextValueRange(
                  chart.context,
                ),
                dygraphTitleHeight: NODE_VIEW_DYGRAPH_TITLE_HEIGHT,
                before: 0,
                after: -duration,
                heightId: `${name2id(`${options.hostname}/${chart.id}`)}`,
                colors: `${netdataDashboard.anyAttribute(
                  netdataDashboard.context, "colors", chart.context, "",
                )}`,
                decimalDigits: netdataDashboard.contextDecimalDigits(
                  chart.context, -1,
                ),
                forceTimeWindow: true,
                // add commonMin/commonMax attributes only if they are set
                ...(commonMin ? { commonMin } : {}),
                ...(commonMax ? { commonMax } : {}),
                ...commonAttributesOverrides,
                ...(attributesOverrides ? attributesOverrides[chart.id] : {}),
                nodeIDs,
              }}
              chartMetadata={chartsMetadata.charts[chart.id]}
              dropdownMenu={dropdownMenu}
              renderCustomElementForDygraph={renderCustomElementForDygraph}
            />
          </div>
        )
      })}
    </div>
  )
}
