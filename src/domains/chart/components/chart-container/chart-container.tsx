import React from "react"

import { Attributes } from "../../utils/transformDataAttributes"
import { ChartMetadata } from "../../chart-types"
import { ChartWithLoader, RenderCustomElementForDygraph } from "../chart-with-loader"
import { DisableOutOfView } from "../disable-out-of-view"
import { DropdownMenu } from "../chart-dropdown"

export type Props = {
  attributes: Attributes
  // warning! this is not the same as chartId in old dashboard
  // here, the chartID must be unique across all agents
  chartUuid: string
  portalNode: HTMLElement
  chartMetadata?: ChartMetadata | undefined
  dropdownMenu?: DropdownMenu
  renderCustomElementForDygraph?: RenderCustomElementForDygraph
}

export const ChartContainer = ({
  attributes,
  chartMetadata,
  chartUuid,
  dropdownMenu,
  portalNode,
  renderCustomElementForDygraph,
}: Props) => (
  <DisableOutOfView
    attributes={attributes}
    portalNode={portalNode}
    chartUuid={chartUuid}
  >
    <ChartWithLoader
      attributes={attributes}
      chartUuid={chartUuid}
      renderCustomElementForDygraph={renderCustomElementForDygraph}
      dropdownMenu={dropdownMenu}
      externalChartMetadata={chartMetadata}
      portalNode={portalNode}
    />
  </DisableOutOfView>
)
