import React from "react"
import { ChartHeadsContainer } from "domains/charts/chartHead"
import { withSubMenu } from "domains/charts/subMenu"

export const ChartSubMenuHeads = props =>
  props.ids.length ? <ChartHeadsContainer {...props} /> : null

export const ChartSubMenuHeadsContainer = withSubMenu(ChartSubMenuHeads, ({ headIds: ids }) => ({
  ids,
}))
