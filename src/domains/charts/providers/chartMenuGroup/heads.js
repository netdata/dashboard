import React from "react"
import { ChartHeadsContainer } from "domains/charts/providers/chartHead"
import { withSubMenu } from "domains/charts/providers/subMenu"

export const ChartSubMenuHeads = ({ ids }) =>
  ids.length ? <ChartHeadsContainer ids={ids} /> : null

export const ChartSubMenuHeadsContainer = withSubMenu(ChartSubMenuHeads, ({ headIds: ids }) => ({
  ids,
}))
