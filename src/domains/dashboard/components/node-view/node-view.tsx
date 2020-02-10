import { mergeAll } from "ramda"
import React, {
  useRef, useState, useEffect,
} from "react"

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
    Object.values(chartsMetadata.charts).map((chart) => ({ [chart.name]: chart })),
  )


  const [width, setWidth] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!width && ref.current) {
      setWidth(ref.current.getBoundingClientRect().width)
    }
  }, [width])


  // const menus = renderChartsAndMenu(chartsMetadata)
  // const output = renderPage(menus, chartsMetadata)

  // const isPrintMode = false // needs to be implemented when it will be used in main.js
  const pcentWidth = Math.floor(100 / chartsPerRow())
  const duration = Math.round(
    ((((width * pcentWidth) / 100) * chartsMetadata.update_every) / 3) / 60,
  ) * 60


  return (
    <div>
      <HeadMain
        charts={chartsMetadata.charts}
        duration={240} // todo
      />
    </div>
  )
}
