import React from "react"
import { Text } from "@netdata/netdata-ui"
import { withSubMenu } from "domains/charts/providers/subMenu"

export const ChartSubMenuDescription = ({ info, ...rest }) =>
  info ? (
    <Text
      as="p"
      color="border"
      role="document"
      dangerouslySetInnerHTML={{ __html: info }}
      {...rest}
    />
  ) : null

export const ChartSubMenuDescriptionContainer = withSubMenu(ChartSubMenuDescription)
