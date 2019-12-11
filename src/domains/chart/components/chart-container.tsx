import React from "react"

import { ChartWithLoader } from "domains/chart/components/chart-with-loader"
import { Attributes } from "../utils/transformDataAttributes"

import { DisableOutOfView } from "./disable-out-of-view"


export type Props = {
  attributes: Attributes
  portalNode: HTMLElement
}

export const ChartContainer = ({
  attributes,
  portalNode,
}: Props) => (
  <DisableOutOfView
    attributes={attributes}
    portalNode={portalNode}
  >
    <ChartWithLoader
      attributes={attributes}
      // todo change to uuid generator (when we disconnect dashboard.js)
      chartUuid={`${attributes.id}`}
      portalNode={portalNode}
    />
  </DisableOutOfView>
)
