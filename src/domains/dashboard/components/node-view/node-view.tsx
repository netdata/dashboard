import { mergeAll } from "ramda"
import React from "react"

// needs to be imported before "dashboard_info"
import "../../utils/netdata-dashboard"
import "dashboard_info"

import { ChartsMetadata } from "domains/global/types"
import { ChartDetails } from "domains/chart/chart-types"
import { renderChartsAndMenu } from "domains/dashboard/utils/render-charts-and-menu"

interface ChartsMetadataEnriched extends ChartsMetadata {
  // eslint-disable-next-line camelcase
  charts_by_name: {[key: string]: ChartDetails}
}

interface Props {
  charts: ChartsMetadata
}
export const NodeView = ({
  charts,
}: Props) => {
  // example of id and name difference:
  // id: "disk_inodes./Volumes/Recovery"
  // name: "disk_inodes._Volumes_Recovery"
  const chartsByName = mergeAll(
    Object.values(charts.charts).map((chart) => ({ [chart.name]: chart })),
  )

  const output = renderChartsAndMenu(charts)

  return (
    <div>Node View</div>
  )
}
