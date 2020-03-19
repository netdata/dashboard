import React from "react"
import { ChartWithLoader } from "domains/chart/components/chart-with-loader"
import { Attributes } from "../utils/transformDataAttributes"
import { DisableOutOfView } from "./disable-out-of-view"
import { ChartMetadata } from "../chart-types"


export type Props = {
  attributes: Attributes
  // warning! this is not the same as chartId in old dashboard
  // here, the chartID must be unique across all agents
  chartUuid: string
  portalNode: HTMLElement
  chartMetadata?: ChartMetadata
}

export const ChartContainer = ({
  attributes,
  chartUuid,
  portalNode,
  chartMetadata,
}: Props) => (
  <DisableOutOfView
    attributes={attributes}
    portalNode={portalNode}
    chartUuid={chartUuid}
  >
    <ChartWithLoader
      attributes={attributes}
      chartUuid={chartUuid}
      portalNode={portalNode}
      externalChartMetadata={chartMetadata}
    />
  </DisableOutOfView>
)
