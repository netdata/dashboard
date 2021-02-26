import React from "react"
import { TextMicro } from "@netdata/netdata-ui"
import { withChart } from "./context"

export const ChartTitle = ({ title, ...rest }) => (
  <TextMicro strong truncate title={title} {...rest}>
    {title}
  </TextMicro>
)

export const ChartTitleContainer = withChart(ChartTitle, "title")

// text-indent: 36px;
// text-align: left;
// position: absolute;
// left: 0px;
// top: 4px;
// font-size: 11px;
// font-weight: bold;
// text-overflow: ellipsis;
// overflow: hidden;
// white-space: nowrap;
