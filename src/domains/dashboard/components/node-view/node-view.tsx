import React, {
  useRef, useState, useEffect,
} from "react"
import classNames from "classnames"

import { name2id } from "utils/name-2-id"
import { ChartsMetadata } from "domains/global/types"
import { ChartDetails } from "domains/chart/chart-types"
import { Attributes } from "domains/chart/utils/transformDataAttributes"

import { renderChartsAndMenu } from "domains/dashboard/utils/render-charts-and-menu"
import { Menu, options } from "domains/dashboard/utils/netdata-dashboard"
import { parseChartString } from "domains/dashboard/utils/parse-chart-string"
import { sortObjectByPriority, prioritySort } from "domains/dashboard/utils/sorting"
import { HeadMain } from "domains/dashboard/components/head-main"

import { ChartWrapper } from "domains/dashboard/components/chart-wrapper"

// needs to be imported before "dashboard_info"
// eslint-disable-next-line import/order
import { netdataDashboard } from "../../utils/netdata-dashboard"
import "dashboard_info"

import "./node-view.scss"

const chartsPerRow = () => (
  options.chartsPerRow === 0 ? 1 : options.chartsPerRow
)


type HeadDescription = ((os: string, id: string) => string) | string

function generateHeadCharts(type: string, chart: ChartDetails, duration: number) {
  // todo don't add head charts on print view
  // if (urlOptions.mode === 'print') {
  //   return '';
  // }

  const hcharts = netdataDashboard.anyAttribute(netdataDashboard.context, type, chart.context, [])
  return hcharts.map((hChart: HeadDescription) => (typeof hChart === "function"
    ? hChart(netdataDashboard.os, chart.id)
      .replace(/CHART_DURATION/g, duration.toString())
      .replace(/CHART_UNIQUE_ID/g, chart.id)
    : hChart.replace(/CHART_DURATION/g, duration.toString())
      .replace(/CHART_UNIQUE_ID/g, chart.id)
  ))
}

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


interface SubSectionProps {
  chartsMetadata: ChartsMetadata
  duration: number
  menu: Menu
  pcentWidth: number
  shouldDisplayHeadMain: boolean
}
const SubSection = ({
  chartsMetadata,
  duration,
  menu,
  pcentWidth,
  shouldDisplayHeadMain,
}: SubSectionProps) => {
  const submenuNames = sortObjectByPriority(menu.submenus)
  return (
    <div role="region" className="dashboard-subsection">
      {/* eslint-disable-next-line react/no-danger */}
      <span dangerouslySetInnerHTML={{ __html: menu.info }} />
      <div className="netdata-chart-row">
        {shouldDisplayHeadMain && (
          <HeadMain
            charts={chartsMetadata.charts}
            duration={duration}
          />
        )}
        {submenuNames.flatMap(
          (submenu) => menu.submenus[submenu].charts
            .concat().sort(prioritySort) // shallow clone, sort by priority
            .flatMap((chart) => generateHeadCharts("mainheads", chart, duration))
            .map(parseChartString)
            .map((attributes: Attributes | null) => (
              attributes && (
                <ChartWrapper
                  attributes={attributes}
                  key={`${attributes.id}-${attributes.dimensions}`}
                />
              )
            )),
        )}
      </div>
      {submenuNames.map((submenu: string) => {
        const submenuID = name2id(`menu_${menu}_submenu_${submenu}`)
        const chartsSorted = menu.submenus[submenu].charts
          .concat() // shallow clone
          .sort(prioritySort)
        const submenuInfo = menu.submenus[submenu].info
        return (
          <div
            role="region"
            className="dashboard-section-container"
            id={submenuID}
            key={submenu}
          >
            <h2 id={submenuID} className="netdata-chart-alignment">
              {menu.submenus[submenu].title}
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
                .map((attributes: Attributes | null) => (
                  attributes && (
                    <ChartWrapper
                      attributes={attributes}
                      key={`${attributes.id}-${attributes.dimensions}`}
                    />
                  )
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
      })}

    </div>
  )
}


interface Props {
  chartsMetadata: ChartsMetadata
}
export const NodeView = ({
  chartsMetadata,
}: Props) => {
  const [width, setWidth] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!width && ref.current) {
      setWidth(ref.current.getBoundingClientRect().width)
    }
  }, [width])


  // todo support print mode when it will be used in main.js
  const pcentWidth = Math.floor(100 / chartsPerRow())
  const duration = Math.round(
    ((((width * pcentWidth) / 100) * chartsMetadata.update_every) / 3) / 60,
  ) * 60

  const menus = renderChartsAndMenu(chartsMetadata)
  const main = sortObjectByPriority(menus)

  return (
    <div className="node-view__container">
      <div ref={ref} className="charts-body" role="main">
        {!!duration && (
          main.map((menuName, menuIndex) => {
            const menu = menus[menuName]
            return (
              <div role="region" className="dashboard-section" key={menuName}>
                <div>
                  <h1 id={name2id(`menu_${menuName}`)}>
                    {/* eslint-disable-next-line react/no-danger */}
                    <span dangerouslySetInnerHTML={{ __html: menu.icon }} />
                    {" "}
                    {menu.title}
                  </h1>
                </div>
                <SubSection
                  chartsMetadata={chartsMetadata}
                  duration={duration}
                  menu={menu}
                  pcentWidth={pcentWidth}
                  shouldDisplayHeadMain={menuIndex === 0}
                />
              </div>
            )
          })
        )}
      </div>
      <div className="node-view__sidebar" role="complementary">
        <ul className="nav dashboard-sidenav">
          {main.map((menuName) => {
            const menu = menus[menuName]
            const menuID = name2id(`menu_${menuName}`)
            const submenuNames = sortObjectByPriority(menu.submenus)
            const isMenuActive = menuName === "system" // todo
            return (
              <li
                key={menuName}
                className={classNames(
                  "node-view__sidebar-menu-li",
                  { "node-view__sidebar-menu-li--active": isMenuActive },
                )}
              >
                <a
                  className="node-view__sidebar-link"
                  href={`#${menuID}`}
                  onClick={() => {}}
                >
                  {/* eslint-disable-next-line react/no-danger */}
                  <span dangerouslySetInnerHTML={{ __html: menu.icon }} />
                  {" "}
                  {menu.title}
                </a>
                <ul
                  className={classNames(
                    "node-view__sidebar-submenu",
                  )}
                >
                  {submenuNames.map((submenuName) => {
                    const submenuID = name2id(`menu_${menu}_submenu_${submenuName}`)
                    const submenu = menu.submenus[submenuName]
                    const isSubmenuActive = submenuName === "ram" // todo
                    return (
                      <li
                        key={submenuName}
                        className={classNames(
                          "node-view__sidebar-submenu-li",
                          { "node-view__sidebar-submenu-li--active": isSubmenuActive },
                        )}
                      >
                        <a
                          className="node-view__sidebar-link"
                          href={`#${submenuID}`}
                        >
                          {submenu.title}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
