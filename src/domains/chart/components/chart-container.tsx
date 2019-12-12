import React from "react"

import { ChartWithLoader } from "domains/chart/components/chart-with-loader"
import { Attributes } from "../utils/transformDataAttributes"

import { DisableOutOfView } from "./disable-out-of-view"


export type Props = {
  attributes: Attributes
  // warning! this is not the same as chartId in old dashboard
  // here, the chartId must be unique across all agents
  chartId: string
  portalNode: HTMLElement
}

export const ChartContainer = ({
  attributes,
  chartId,
  portalNode,
}: Props) => (
  <DisableOutOfView
    attributes={attributes}
    portalNode={portalNode}
  >
    <ChartWithLoader
      attributes={attributes}
      chartUuid={chartId}
      portalNode={portalNode}
    />
  </DisableOutOfView>
)
