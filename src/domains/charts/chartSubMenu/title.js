import React from "react"
import { H3, TextBig } from "@netdata/netdata-ui"
import { withSubMenu } from "domains/charts/subMenu"

export const ChartSubMenuTitle = ({ title, ...rest }) =>
  title ? (
    <H3 color="sectionTitle" strong={false} {...rest}>
      {title}
    </H3>
  ) : null

export const ChartSubMenuTitleContainer = withSubMenu(ChartSubMenuTitle, ({ title }) => ({ title }))
