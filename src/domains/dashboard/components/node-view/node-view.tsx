import React, { memo, useRef, useState, useEffect, useMemo } from "react"
import { useScroll, useDebounce } from "react-use"
import { name2id } from "utils/name-2-id"
import { mapDefaultAggrMethod } from "utils/fill-missing-data"
import { ReportEvent } from "types/report"
import { ChartsMetadata } from "domains/global/types"
import { Attributes, ChartsAttributes } from "domains/chart/utils/transformDataAttributes"
import { DropdownMenu } from "domains/chart/components/chart-dropdown"
import { RenderCustomElementForDygraph } from "domains/chart/components/chart-with-loader"
import ChartsProvider, { SidebarContainer } from "domains/charts/providers"
import { renderChartsAndMenu } from "../../utils/render-charts-and-menu"
import { Menu, options } from "../../utils/netdata-dashboard"
import { parseChartString } from "../../utils/parse-chart-string"
import { sortObjectByPriority, prioritySort } from "../../utils/sorting"
import { HeadMain } from "../head-main"
// import { MenuSidebar } from "../menu-sidebar"
import { ChartWrapper } from "../chart-wrapper"
import { renderSubmenuName } from "./render-submenu-name"
import { generateHeadCharts } from "./generate-head-charts"
import { useUpdateTheme } from "./use-update-theme"
import "@/src/dashboard_info"
import "./node-view.scss"

const chartsPerRow = () => (options.chartsPerRow === 0 ? 1 : options.chartsPerRow)

interface SubSectionProps {
  chartsMetadata: ChartsMetadata
  dropdownMenu?: DropdownMenu
  duration: number
  host: string
  menu: Menu
  menuName: string
  pcentWidth: number
  renderCustomElementForDygraph?: RenderCustomElementForDygraph
  onAttributesChange: any
  renderBeforeCharts?: any
  shouldDisplayHeadMain: boolean
  commonAttributesOverrides?: Partial<Attributes>
  attributesOverrides: ChartsAttributes
  nodeIDs?: string[]
}

const emptyObject = {} as any
const emptyNodeIDs: string[] = []
const noop = () => {}

const SubSection = memo(
  ({
    chartsMetadata,
    dropdownMenu,
    duration,
    host,
    menu,
    menuName,
    pcentWidth,
    renderCustomElementForDygraph,
    onAttributesChange,
    renderBeforeCharts,
    shouldDisplayHeadMain,
    attributesOverrides,
    commonAttributesOverrides,
    nodeIDs = emptyNodeIDs,
  }: SubSectionProps) => {
    const disableHeads = menuName.startsWith("Kubernetes")
    const submenuNames = sortObjectByPriority(menu.submenus)

    return (
      <div role="region" className="dashboard-subsection">
        {/* eslint-disable-next-line react/no-danger */}
        <span dangerouslySetInnerHTML={{ __html: menu.info }} />
        {renderBeforeCharts &&
          renderBeforeCharts({
            menuName,
            chartIds: submenuNames
              .flatMap((name: string) => menu.submenus[name].charts)
              .sort(prioritySort)
              .map((chart: any) => chart.id) as string[],
            chartsAttributes: attributesOverrides,
            chartsMetadata,
            onAttributesChange,
            host,
            nodeIDs,
          })}
        <div className="netdata-chart-row">
          {shouldDisplayHeadMain && (
            <HeadMain
              charts={chartsMetadata.charts}
              duration={duration}
              host={host}
              chartsMetadata={chartsMetadata}
              nodeIDs={nodeIDs}
              commonAttributesOverrides={commonAttributesOverrides}
            />
          )}
          {!disableHeads &&
            submenuNames.flatMap(submenu =>
              menu.submenus[submenu].charts
                .concat()
                .sort(prioritySort) // shallow clone, sort by priority
                .flatMap(chart => generateHeadCharts("mainheads", chart, duration))
                .map(parseChartString)
                .map(
                  (attributes: Attributes | null) =>
                    attributes && (
                      <ChartWrapper
                        attributes={{
                          ...attributes,
                          forceTimeWindow: true, // respect timeWindow
                          aggrMethod: mapDefaultAggrMethod(
                            chartsMetadata.charts[attributes.id].units
                          ),
                          host,
                          nodeIDs,
                          ...commonAttributesOverrides,
                        }}
                        key={`${attributes.id}-${attributes.dimensions}`}
                        chartMetadata={chartsMetadata.charts[attributes.id]}
                      />
                    )
                )
            )}
        </div>
        {submenuNames.map(
          renderSubmenuName({
            disableHeads,
            chartsMetadata,
            renderCustomElementForDygraph,
            onAttributesChange,
            dropdownMenu,
            duration,
            host,
            menu,
            menuName,
            pcentWidth,
            attributesOverrides,
            nodeIDs,
            commonAttributesOverrides,
          })
        )}
      </div>
    )
  }
)

const isSectionNodeVisible = (node: Element) =>
  (node.getAttribute("id") as string).startsWith("menu") && node.getBoundingClientRect().top > 0

const activeMenuInitialState = { activeMenuId: "", activeSubMenuId: "" }

interface Props {
  chartsMetadata: ChartsMetadata
  dropdownMenu?: DropdownMenu
  host?: string
  renderCustomElementForDygraph?: RenderCustomElementForDygraph
  onAttributesChange?: any
  renderBeforeCharts?: any
  scrollableContainerRef: React.RefObject<HTMLDivElement>
  timeWindow?: number
  attributes?: ChartsAttributes
  commonAttributesOverrides?: Partial<Attributes>
  metricsCorrelationMetadata?: ChartsMetadata
  children?: React.ReactNode | React.ReactNode[]
  nodeIDs?: string[]
  reportEvent?: ReportEvent
  defaultChart?: string
  onChangeChart?: (chart: string) => void
  hasKubernetes?: boolean
}
export const NodeView = ({
  chartsMetadata,
  dropdownMenu,
  host = "http://localhost:19999",
  renderCustomElementForDygraph,
  onAttributesChange,
  renderBeforeCharts,
  scrollableContainerRef,
  timeWindow,
  attributes = emptyObject,
  commonAttributesOverrides,
  metricsCorrelationMetadata,
  children,
  nodeIDs,
  reportEvent = noop,
  defaultChart = "",
  onChangeChart,
  hasKubernetes = false,
}: Props) => {
  const [width, setWidth] = useState(0)
  const [currentChart, setCurrentChart] = useState(defaultChart)

  const [activeMenu, setActiveMenu] = useState(activeMenuInitialState)

  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!width && ref.current) {
      setWidth(ref.current.getBoundingClientRect().width)
    }
  }, [width])

  useEffect(() => {
    if (!defaultChart) return

    const timeoutID = setTimeout(() => {
      const chartElement = document.querySelector(`#${defaultChart}`)
      if (chartElement) chartElement.scrollIntoView()
    })
    // eslint-disable-next-line consistent-return
    return () => clearTimeout(timeoutID)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { y } = useScroll(scrollableContainerRef)
  useDebounce(
    () => {
      if (ref.current) {
        const currentNode = Array.from(ref.current.querySelectorAll("[id]")).find(
          isSectionNodeVisible
        )

        if (!currentNode) {
          return
        }

        const chartIdInMenu = currentNode.getAttribute("id") as string

        const [, activeMenuId = "", activeSubMenuId = ""] =
          chartIdInMenu.match(/menu_(.*)_submenu_(.*)/) || []
        const [, singleActiveMenuId = ""] = chartIdInMenu.match(/menu_(.*)/) || []
        setActiveMenu({ activeMenuId: activeMenuId || singleActiveMenuId, activeSubMenuId })

        setCurrentChart(chartIdInMenu)
        if (onChangeChart) onChangeChart(chartIdInMenu)
      }
    },
    100,
    [y]
  )

  // todo support print mode when it will be used in main.js
  const pcentWidth = Math.floor(100 / chartsPerRow())
  const duration =
    timeWindow ||
    Math.round((((width * pcentWidth) / 100) * chartsMetadata.update_every) / 3 / 60) * 60

  const menuPartialMetadata = metricsCorrelationMetadata || chartsMetadata
  // This is used to generate and show some statistics VS the full dataset
  const fullMetadata = metricsCorrelationMetadata && chartsMetadata
  const menus = useMemo(
    () => renderChartsAndMenu(menuPartialMetadata, fullMetadata, hasKubernetes),
    [menuPartialMetadata, fullMetadata, hasKubernetes]
  )
  const main = useMemo(() => sortObjectByPriority(menus), [menus])

  useUpdateTheme()

  const chartsProviderProps = useMemo(() => {
    const chartIds = Object.keys(chartsMetadata.charts)
    const getChart = id => chartsMetadata.charts[id]
    return { chartIds, getChart }
  }, [chartsMetadata.charts])

  return (
    // @ts-ignore
    <ChartsProvider {...activeMenu} {...chartsProviderProps}>
      <div className="node-view__container">
        <div ref={ref} className="charts-body" role="main">
          {children}
          {!!duration &&
            main.map((menuName, menuIndex) => {
              const menu = menus[menuName]
              return (
                <div role="region" className="dashboard-section" key={menuName}>
                  <div>
                    <h1 id={name2id(`menu_${menuName}`)}>
                      {/* eslint-disable-next-line react/no-danger */}
                      <span dangerouslySetInnerHTML={{ __html: menu.icon }} /> {menu.title}
                    </h1>
                  </div>
                  <SubSection
                    renderCustomElementForDygraph={renderCustomElementForDygraph}
                    onAttributesChange={onAttributesChange}
                    renderBeforeCharts={renderBeforeCharts}
                    duration={duration}
                    dropdownMenu={dropdownMenu}
                    menu={menu}
                    menuName={menuName}
                    pcentWidth={pcentWidth}
                    shouldDisplayHeadMain={menuIndex === 0}
                    host={host}
                    chartsMetadata={metricsCorrelationMetadata || chartsMetadata}
                    attributesOverrides={attributes}
                    commonAttributesOverrides={commonAttributesOverrides}
                    nodeIDs={nodeIDs}
                  />
                </div>
              )
            })}
        </div>
        <SidebarContainer />
        {/* <MenuSidebar
          currentChart={currentChart}
          menuNames={main}
          menus={menus}
          reportEvent={reportEvent}
        /> */}
      </div>
    </ChartsProvider>
  )
}
