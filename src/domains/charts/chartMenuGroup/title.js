import React from "react"
import { H1 } from "@netdata/netdata-ui"
import { withMenuGroup } from "domains/charts/menuGroup"

export const ChartMenuGroupIcon = ({ icon, ...rest }) => (
  <span dangerouslySetInnerHTML={{ __html: icon }} {...rest} />
)

export const ChartMenuGroupTitle = ({ title, ...rest }) =>
  title ? (
    <H1 color="sectionTitle" {...rest}>
      {title}
    </H1>
  ) : null

export const ChartMenuGroupTitleContainer = withMenuGroup(
  ChartMenuGroupTitle,
  ({ icon, title }) => ({ icon, title })
)
