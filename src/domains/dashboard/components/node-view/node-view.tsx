import React, {
  memo, useRef, useState, useEffect, useMemo,
} from "react"
import { useWindowScroll } from "react-use"
import { name2id } from "utils/name-2-id"
import { ChartsMetadata } from "domains/global/types"
import { Attributes } from "domains/chart/utils/transformDataAttributes"
import { renderChartsAndMenu } from "../../utils/render-charts-and-menu"
import { Menu, options } from "../../utils/netdata-dashboard"
import { parseChartString } from "../../utils/parse-chart-string"
import { sortObjectByPriority, prioritySort } from "../../utils/sorting"
import { HeadMain } from "../head-main"
import { MenuSidebar } from "../menu-sidebar"
import { ChartWrapper } from "../chart-wrapper"
import { renderSubmenuName } from "./render-submenu-name"
import { generateHeadCharts } from "./generate-head-charts"
import "dashboard_info"
import "./node-view.scss"

const chartsPerRow = () => (
  options.chartsPerRow === 0 ? 1 : options.chartsPerRow
)


interface SubSectionProps {
  duration: number
  menu: Menu
  menuName: string
  pcentWidth: number
  shouldDisplayHeadMain: boolean
  host: string
  chartsMetadata: ChartsMetadata
}
const SubSection = memo(({
  duration,
  menu,
  menuName,
  pcentWidth,
  shouldDisplayHeadMain,
  host,
  chartsMetadata,
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
            host={host}
            chartsMetadata={chartsMetadata}
          />
        )}
        {submenuNames.flatMap(
          (submenu) => menu.submenus[submenu].charts
            .concat().sort(prioritySort) // shallow clone, sort by priority
            .flatMap((chart) => generateHeadCharts("mainheads", chart, duration))
            .map(parseChartString)
            .map((attributes: Attributes | null) => attributes && (
              <ChartWrapper
                attributes={{ ...attributes, host }}
                key={`${attributes.id}-${attributes.dimensions}`}
                chartMetadata={chartsMetadata.charts[attributes.id]}
              />
            )),
        )}
      </div>
      {submenuNames.map(renderSubmenuName({
        duration, menu, menuName, pcentWidth, host, chartsMetadata,
      }))}
    </div>
  )
})

const isSectionNodeVisible = (node: Element) => (node.getAttribute("id") as string)
  .startsWith("menu") && node.getBoundingClientRect().top > 0

interface Props {
  chartsMetadata: ChartsMetadata
  currentChart: string
  setCurrentChart: (currentChart: string) => void
  host?: string
}
export const NodeView = ({
  chartsMetadata,
  currentChart,
  setCurrentChart,
  host = "http://localhost:19999",
}: Props) => {
  const [width, setWidth] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!width && ref.current) {
      setWidth(ref.current.getBoundingClientRect().width)
    }
  }, [width])


  const { y } = useWindowScroll()
  useEffect(() => {
    if (ref.current) {
      const currentNode = Array.from(ref.current.querySelectorAll("[id]"))
        .find(isSectionNodeVisible)

      if (!currentNode) {
        return
      }

      const chartIdInMenu = currentNode.getAttribute("id") as string
      setCurrentChart(chartIdInMenu)
    }
  }, [ref, setCurrentChart, y])


  // todo support print mode when it will be used in main.js
  const pcentWidth = Math.floor(100 / chartsPerRow())
  const duration = Math.round(
    ((((width * pcentWidth) / 100) * chartsMetadata.update_every) / 3) / 60,
  ) * 60

  const menus = useMemo(() => renderChartsAndMenu(chartsMetadata), [chartsMetadata])
  const main = useMemo(() => sortObjectByPriority(menus), [menus])

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
                  duration={duration}
                  menu={menu}
                  menuName={menuName}
                  pcentWidth={pcentWidth}
                  shouldDisplayHeadMain={menuIndex === 0}
                  host={host}
                  chartsMetadata={chartsMetadata}
                />
              </div>
            )
          })
        )}
      </div>
      <MenuSidebar
        currentChart={currentChart}
        menuNames={main}
        menus={menus}
      />
    </div>
  )
}
