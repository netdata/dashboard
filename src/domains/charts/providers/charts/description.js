import React from "react"
import { Text } from "@netdata/netdata-ui"
import { withMenuChartAttributes } from "./context"

export const ChartDescription = ({ info, ...rest }) =>
  info ? <Text color="border" dangerouslySetInnerHTML={{ __html: info }} {...rest} /> : null

export const ChartDescriptionContainer = withMenuChartAttributes(ChartDescription, "info")
