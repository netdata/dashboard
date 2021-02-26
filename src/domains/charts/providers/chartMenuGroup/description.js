import React from "react"
import { Text } from "@netdata/netdata-ui"
import { withMenuGroup } from "domains/charts/providers/menuGroup"

export const ChartMenuGroupDescription = ({ children, ...rest }) =>
  children ? <Text color="border" dangerouslySetInnerHTML={{ __html: children }} {...rest} /> : null

export const ChartMenuGroupDescriptionContainer = withMenuGroup(
  ChartMenuGroupDescription,
  ({ info }) => ({ children: info })
)
