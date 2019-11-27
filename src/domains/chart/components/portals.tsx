import React from "react"
import { createPortal } from "react-dom"

import { getAttributes } from "../utils/transformDataAttributes"
import { ChartContainer } from "./chart-container"
import { DisableOutOfView } from "./disable-out-of-view"

const getNodesArray = () => Array.from(document.querySelectorAll("[data-netdata]"))

export const Portals = () => {
  const nodes = getNodesArray()
  return (
    <>
      {nodes.map((node, index) => {
        const attributesMapped = getAttributes(node)
        return (
          createPortal(
            <DisableOutOfView
              attributes={attributesMapped}
              portalNode={(node as HTMLElement)}
            >
              <ChartContainer
                attributes={attributesMapped}
                // todo change to uuid generator (when we disconnect dashboard.js)
                chartUuid={`${attributesMapped.id}-${index}`}
                portalNode={(node as HTMLElement)}
              />
            </DisableOutOfView>,
            node,
          )
        )
      })}
    </>
  )
}
