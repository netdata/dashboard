import React from "react"

import { Attributes } from "../../utils/transformDataAttributes"
import { ChartMetadata } from "../../chart-types"
import { ChartWithLoader } from "../chart-with-loader"
import { DisableOutOfView } from "../disable-out-of-view"
import { DropdownMenu } from "../chart-dropdown"

export type Props = {
  attributes: Attributes
  // warning! this is not the same as chartId in old dashboard
  // here, the chartID must be unique across all agents
  chartUuid: string
  portalNode: HTMLElement
  chartMetadata?: ChartMetadata
  dropdownMenu?: DropdownMenu
}

export const ChartContainer = ({
  attributes,
  chartUuid,
  portalNode,
  chartMetadata,
  dropdownMenu,
}: Props) => (
  <DisableOutOfView
    attributes={attributes}
    portalNode={portalNode}
    chartUuid={chartUuid}
  >
    <ChartWithLoader
      attributes={attributes}
      chartUuid={chartUuid}
      dropdownMenu={dropdownMenu}
      portalNode={portalNode}
      externalChartMetadata={chartMetadata}
    />
  </DisableOutOfView>
)
