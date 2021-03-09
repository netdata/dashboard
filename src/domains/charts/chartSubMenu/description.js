import React from "react"
import { withSubMenu } from "domains/charts/subMenu"
import Description from "domains/charts/description"

export const ChartSubMenuDescription = props => <Description as="p" role="document" {...props} />

export const ChartSubMenuDescriptionContainer = withSubMenu(
  ChartSubMenuDescription,
  ({ info }) => ({ children: info })
)
