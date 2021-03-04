// @ts-nocheck

import React, { useRef } from "react"
import { ReportEvent } from "types/report"
import { ChartsMetadata } from "domains/global/types"
import { Attributes, ChartsAttributes } from "domains/chart/utils/transformDataAttributes"
import { DropdownMenu } from "domains/chart/components/chart-dropdown"
import { RenderCustomElementForDygraph } from "domains/chart/components/chart-with-loader"
import { MenuSidebar } from "../menu-sidebar"
import { useUpdateTheme } from "./use-update-theme"
import useCurrentChart from "./useCurrentChart"
import useMenu from "./useMenu"
import DashboardCharts from "./dashboardCharts"
import "@/src/dashboard_info"
import "./node-view.scss"

const emptyObject = {} as any
const noop = () => {}

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
  const ref = useRef<HTMLDivElement>(null)

  const [currentChart] = useCurrentChart({ ref, scrollableContainerRef, onChangeChart, defaultChart })

  const [main, menus] = useMenu({ metricsCorrelationMetadata, chartsMetadata, hasKubernetes })

  useUpdateTheme()

  return (
    <div className="node-view__container">
      <DashboardCharts
        ref={ref}
        main={main}
        menus={menus}
        defaultChart={defaultChart}
        timeWindow={timeWindow}
        chartsMetadata={chartsMetadata}
        renderCustomElementForDygraph={renderCustomElementForDygraph}
        onAttributesChange={onAttributesChange}
        renderBeforeCharts={renderBeforeCharts}
        dropdownMenu={dropdownMenu}
        host={host}
        metricsCorrelationMetadata={metricsCorrelationMetadata}
        attributes={attributes}
        commonAttributesOverrides={commonAttributesOverrides}
        nodeIDs={nodeIDs}
      >
        {children}
      </DashboardCharts>
      <MenuSidebar
        currentChart={currentChart}
        // @ts-ignore
        menuNames={main}
        // @ts-ignore
        menus={menus}
        reportEvent={reportEvent}
      />
    </div>
  )
}
