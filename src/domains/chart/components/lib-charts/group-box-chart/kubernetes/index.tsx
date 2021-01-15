/* eslint-disable react/prop-types */
// @ts-nocheck
import React, { useMemo, useRef, useContext } from "react"
import { ChartMetadata } from "domains/chart/chart-types"
// import { Attributes } from "../../../utils/transformDataAttributes"
import GroupBoxes from "domains/chart/components/lib-charts/group-box-chart/groupBoxes"
import { ChartContainer } from "domains/chart/components/chart-container"
import { selectChartData } from "domains/chart/selectors"
import { ThemeContext } from "styled-components"
import { Flex, getColor, Text } from "@netdata/netdata-ui"
import BoxPopover from "./boxPopover"
import GroupPopover from "./groupPopover"
import { useSelector } from "store/redux-separate-context"
import { ChartWrapper } from "domains/dashboard/components/chart-wrapper"
import { TextOnly } from "domains/chart/components/lib-charts/text-only"
import { netdataDashboard } from "domains/dashboard/utils/netdata-dashboard"
import Chart from "./chart"

interface Props {
  chartData: any
  attributes: Attributes
  chartMetadata: ChartMetadata
}

const Kubernetes = ({
  chartData: { id, groupedBoxes },
  chartMetadata,
  attributes,
  viewAfter,
  viewBefore,
}: any) => {
  const renderBoxPopover = ({ groupIndex, index, align }) => {
    const label = groupedBoxes.data[groupIndex].labels[index]
    return (
      <BoxPopover
        align={align}
        label={label}
        chartMetadata={chartMetadata}
        attributes={attributes}
        viewBefore={viewBefore}
        viewAfter={viewAfter}
      />
    )
  }

  const renderGroupPopover = ({ groupIndex, align }) => {
    const label = groupedBoxes.labels[groupIndex]
    return (
      <GroupPopover
        align={align}
        label={label}
        attributes={attributes}
        chartMetadata={chartMetadata}
        viewBefore={viewBefore}
        viewAfter={viewAfter}
      />
    )
  }

  const chartData = useMemo(() => {
    return {
      ...groupedBoxes,
      data: groupedBoxes.data.map(({ labels, postAggregatedData }) => ({
        labels,
        data: postAggregatedData,
      })),
    }
  }, [groupedBoxes])

  return (
    <GroupBoxes
      id={id}
      chartData={chartData}
      renderBoxPopover={renderBoxPopover}
      renderGroupPopover={renderGroupPopover}
    />
  )
}

export default Kubernetes
