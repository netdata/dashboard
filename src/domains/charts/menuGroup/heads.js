import React from "react"
import { ChartHeadsContainer } from "domains/charts/chartHead"
import { withMenuGroup } from "domains/charts/menuGroup"

export const MenuGroupHeads = ({ ids }) => (ids.length ? <ChartHeadsContainer ids={ids} /> : null)

export const MenuGroupHeadsContainer = withMenuGroup(MenuGroupHeads, ({ headIds: ids }) => ({
  ids,
}))
