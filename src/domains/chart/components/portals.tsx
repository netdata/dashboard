import React, { memo } from "react"
import { createPortal } from "react-dom"

import { getAttributes } from "../utils/transformDataAttributes"
import { ChartWithLoader } from "./chart-with-loader"
import { DisableOutOfView } from "./disable-out-of-view"
import { SnapshotLoaderContainer } from "./snapshot-loader"

const getNodesArray = () => Array.from(document.querySelectorAll("[data-netdata]"))

export const Portals = memo(() => {
  const nodes = getNodesArray()
  return (
    <>
      {nodes.map((node, index) => {
        const attributesMapped = getAttributes(node)
        const chartId = `${attributesMapped.id}-${index}`
        return (
          createPortal(
            <>
              <DisableOutOfView
                attributes={attributesMapped}
                chartUuid={chartId}
                portalNode={(node as HTMLElement)}
              >
                <ChartWithLoader
                  attributes={attributesMapped}
                  // todo change to uuid generator (when we disconnect dashboard.js)
                  chartUuid={chartId}
                  portalNode={(node as HTMLElement)}
                />
              </DisableOutOfView>
              <SnapshotLoaderContainer
                attributes={attributesMapped}
                chartUuid={chartId}
              />
            </>,
            node,
          )
        )
      })}
    </>
  )
})
