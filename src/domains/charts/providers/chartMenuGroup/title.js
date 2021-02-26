import React from "react"
import { H0, Flex } from "@netdata/netdata-ui"
import { withMenuGroup } from "domains/charts/providers/menuGroup"

export const ChartMenuGroupIcon = ({ icon, ...rest }) => (
  <span dangerouslySetInnerHTML={{ __html: icon }} {...rest} />
)

export const ChartMenuGroupTitle = ({ icon, title, ...rest }) => (
  <Flex as={H0} color="key" gap={2} {...rest}>
    <ChartMenuGroupIcon icon={icon} />
    <span>{title}</span>
  </Flex>
)

export const ChartMenuGroupTitleContainer = withMenuGroup(
  ChartMenuGroupTitle,
  ({ icon, title }) => ({ icon, title })
)
