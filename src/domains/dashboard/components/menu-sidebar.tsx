import React from "react"

import { Menus } from "../utils/netdata-dashboard"
import { renderSingleMenu } from "./node-view/render-single-menu"

interface Props {
  currentChart: string
  menuNames: string[]
  menus: Menus
}
export const MenuSidebar = React.memo(({
  currentChart,
  menuNames,
  menus,
}: Props) => {
  const handleScrollToId = (event: React.MouseEvent) => {
    event.preventDefault()
    const chartNodeId = event.currentTarget.getAttribute("href")
    if (chartNodeId) {
      const node = document.getElementById(chartNodeId.replace("#", ""))
      if (node) {
        node.scrollIntoView()
      }
    }
  }

  return (
    <div className="node-view__sidebar" role="complementary">
      <ul className="nav dashboard-sidenav">
        {menuNames.map(renderSingleMenu({
          currentChart,
          handleScrollToId,
          menus,
        }))}
      </ul>
    </div>
  )
})
