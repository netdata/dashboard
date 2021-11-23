import React from "react"
import { H3 } from "@netdata/netdata-ui"
import { withSubMenu } from "domains/charts/subMenu"

export const ChartSubMenuTitle = ({ title, ...rest }) =>
  title ? (
    <H3 color="text" {...rest}>
      {title}
    </H3>
  ) : null

export const ChartSubMenuTitleContainer = withSubMenu(ChartSubMenuTitle, ({ title }) => ({ title }))
