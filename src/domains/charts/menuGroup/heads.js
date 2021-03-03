import React from "react"
import { ChartHeadsContainer } from "domains/charts/chartHead"
import { withMenuGroup } from "domains/charts/menuGroup"

export const MenuGroupHeads = props =>
  props.ids.length ? <ChartHeadsContainer {...props} /> : null

export const MenuGroupHeadsContainer = withMenuGroup(MenuGroupHeads, ({ headIds: ids }) => ({
  ids,
}))
