import React, { memo } from "react"
import { mapDefaultAggrMethod } from "utils/fill-missing-data"
import { ChartsMetadata } from "domains/global/types"
import { Attributes, ChartsAttributes } from "domains/chart/utils/transformDataAttributes"
import { DropdownMenu } from "domains/chart/components/chart-dropdown"
import { RenderCustomElementForDygraph } from "domains/chart/components/chart-with-loader"
import { Menu } from "../../utils/netdata-dashboard"
import { parseChartString } from "../../utils/parse-chart-string"
import { sortObjectByPriority, prioritySort } from "../../utils/sorting"
import { HeadMain } from "../head-main"
import { ChartWrapper } from "../chart-wrapper"
import { renderSubmenuName } from "./render-submenu-name"
import { generateHeadCharts } from "./generate-head-charts"

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

const emptyNodeIDs: string[] = []

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

export default SubSection
