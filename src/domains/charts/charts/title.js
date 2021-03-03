import React from "react"
import { TextMicro } from "@netdata/netdata-ui"
import { withChart } from "./context"

export const ChartTitle = ({ title, ...rest }) => (
  <TextMicro strong truncate title={title} {...rest}>
    {title}
  </TextMicro>
)

export const ChartTitleContainer = withChart(ChartTitle, ({ title }) => ({ title }))
