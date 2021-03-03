import React from "react"
import { H1 } from "@netdata/netdata-ui"
import { withSubMenu } from "domains/charts/subMenu"

export const ChartSubMenuTitle = ({ title, ...rest }) =>
  title ? (
    <H1 color="key" {...rest}>
      {title}
    </H1>
  ) : null

export const ChartSubMenuTitleContainer = withSubMenu(ChartSubMenuTitle, ({ title }) => ({ title }))
