import { mergeAll } from "ramda"
import React from "react"

import { name2id } from "utils/name-2-id"
import { ChartsMetadata } from "domains/global/types"
import { ChartDetails, ChartEnriched } from "domains/chart/chart-types"
import { renderChartsAndMenu } from "domains/dashboard/utils/render-charts-and-menu"
import { Menus, options } from "domains/dashboard/utils/netdata-dashboard"
import { HeadMain } from "domains/dashboard/components/head-main"

// needs to be imported before "dashboard_info"
import "dashboard_info"
import { netdataDashboard } from "../../utils/netdata-dashboard"


interface ChartsMetadataEnriched extends ChartsMetadata {
  // eslint-disable-next-line camelcase
  charts_by_name: {[key: string]: ChartDetails}
}

interface Props {
  chartsMetadata: ChartsMetadata
}
export const NodeView = ({
  chartsMetadata,
}: Props) => {
  // example of id and name difference:
  // id: "disk_inodes./Volumes/Recovery"
  // name: "disk_inodes._Volumes_Recovery"
  const chartsByName = mergeAll(
    Object.values(charts.charts).map((chart) => ({ [chart.name]: chart })),
  )

  const output = renderChartsAndMenu(charts)

  return (
    <div>
      <HeadMain
        charts={chartsMetadata.charts}
        duration={240} // todo
      />
    </div>
  )
}
