import React, {
  memo, useRef, useState, useEffect, useMemo,
} from "react"
import { useScroll } from "react-use"

import { name2id } from "utils/name-2-id"
import { ChartsMetadata } from "domains/global/types"
import { Attributes, ChartsAttributes } from "domains/chart/utils/transformDataAttributes"
import { DropdownMenu } from "domains/chart/components/chart-dropdown"
import { RenderCustomElementForDygraph } from "domains/chart/components/chart-with-loader"

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
  chartsMetadata: ChartsMetadata
  dropdownMenu?: DropdownMenu
  duration: number
  host: string
  menu: Menu
  menuName: string
  pcentWidth: number
  renderCustomElementForDygraph?: RenderCustomElementForDygraph
  shouldDisplayHeadMain: boolean
  attributesOverrides?: ChartsAttributes
  nodeIDs: string[]
}

const emptyNodeIDs: string[] = []

const SubSection = memo(({
  chartsMetadata,
  dropdownMenu,
  duration,
  host,
  menu,
  menuName,
  pcentWidth,
  renderCustomElementForDygraph,
  shouldDisplayHeadMain,
  attributesOverrides,
  nodeIDs = emptyNodeIDs,
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
                attributes={
                  {
                    ...attributes,
                    forceTimeWindow: true, // respect timeWindow
                    host,
                    nodeIDs,
                    ...attributesOverrides,
                  }
                }
                key={`${attributes.id}-${attributes.dimensions}`}
                chartMetadata={chartsMetadata.charts[attributes.id]}
              />
            )),
        )}
      </div>
      {submenuNames.map(renderSubmenuName({
        chartsMetadata,
        renderCustomElementForDygraph,
        dropdownMenu,
        duration,
        host,
        menu,
        menuName,
        pcentWidth,
        attributesOverrides,
      }))}
    </div>
  )
})

const isSectionNodeVisible = (node: Element) => (node.getAttribute("id") as string)
  .startsWith("menu") && node.getBoundingClientRect().top > 0

interface Props {
  chartsMetadata: ChartsMetadata
  dropdownMenu?: DropdownMenu
  host?: string
  renderCustomElementForDygraph?: RenderCustomElementForDygraph
  scrollableContainerRef: React.RefObject<HTMLDivElement>
  timeWindow?: number
  attributes?: ChartsAttributes
  metricsCorrelationMetadata?: ChartsMetadata
  children?: React.ReactNode | React.ReactNode[]
  nodeIDs?: string[]
}
export const NodeView = ({
  chartsMetadata,
  dropdownMenu,
  host = "http://localhost:19999",
  renderCustomElementForDygraph,
  scrollableContainerRef,
  timeWindow,
  attributes,
  metricsCorrelationMetadata,
  children,
  nodeIDs,
}: Props) => {
  const [width, setWidth] = useState(0)
  const [currentChart, setCurrentChart] = useState("")
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!width && ref.current) {
      setWidth(ref.current.getBoundingClientRect().width)
    }
  }, [width])


  const { y } = useScroll(scrollableContainerRef)
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
  const duration = timeWindow || Math.round(
    ((((width * pcentWidth) / 100) * chartsMetadata.update_every) / 3) / 60,
  ) * 60

  const menuPartialMetadata = metricsCorrelationMetadata || chartsMetadata
  // This is used to generate and show some statistics VS the full dataset
  const fullMetadata = metricsCorrelationMetadata && chartsMetadata
  const menus = useMemo(() => renderChartsAndMenu(menuPartialMetadata, fullMetadata),
    [menuPartialMetadata, fullMetadata])
  const main = useMemo(() => sortObjectByPriority(menus), [menus])

  return (
    <div className="node-view__container">
      <div ref={ref} className="charts-body" role="main">
        {children}
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
                  renderCustomElementForDygraph={renderCustomElementForDygraph}
                  duration={duration}
                  dropdownMenu={dropdownMenu}
                  menu={menu}
                  menuName={menuName}
                  pcentWidth={pcentWidth}
                  shouldDisplayHeadMain={menuIndex === 0}
                  host={host}
                  chartsMetadata={metricsCorrelationMetadata || chartsMetadata}
                  attributesOverrides={attributes}
                  nodeIDs={nodeIDs || []}
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
