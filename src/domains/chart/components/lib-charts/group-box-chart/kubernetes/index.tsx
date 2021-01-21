/* eslint-disable comma-dangle */
/* eslint-disable react/prop-types */
// @ts-nocheck
import React, { useMemo } from "react"
import { Flex } from "@netdata/netdata-ui"
import { ChartMetadata } from "domains/chart/chart-types"
// import { Attributes } from "../../../utils/transformDataAttributes"
import { ChartTimeframe } from "domains/chart/components/chart-legend-bottom"
import GroupBoxes from "domains/chart/components/lib-charts/group-box-chart/groupBoxes"
import Legend from "domains/chart/components/lib-charts/group-box-chart/legend"
import GroupPopover from "./groupPopover"
import BoxPopover from "./boxPopover"

interface Props {
  chartData: any
  attributes: Attributes
  chartMetadata: ChartMetadata
  hoveredRow: number
  hoveredX: number | null
}

const getBoxesData = ({ data, postAggregatedData }, hoveredRow) => {
  return hoveredRow === -1 || hoveredRow > data.length ? postAggregatedData : data[hoveredRow] || []
}

const Kubernetes = ({
  chartData,
  chartMetadata,
  attributes,
  viewAfter,
  viewBefore,
  hoveredRow,
  hoveredX,
  showUndefined,
}: any) => {
  const {
    id,
    groupedBoxes: { data, labels },
  } = chartData

  const renderBoxPopover = ({ groupIndex, index, align }) => {
    const groupedLabel = labels[groupIndex]
    const label = data[groupIndex].labels[index]
    return (
      <BoxPopover
        align={align}
        groupedLabel={groupedLabel}
        label={label}
        chartMetadata={chartMetadata}
        attributes={attributes}
        viewBefore={viewBefore}
        viewAfter={viewAfter}
      />
    )
  }

  const renderGroupPopover = ({ groupIndex, align }) => {
    const label = labels[groupIndex]
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

  const groupedBoxesData = useMemo(
    () =>
      data.map((groupedBox) => ({
        labels: groupedBox.labels,
        data: getBoxesData(groupedBox, hoveredRow),
      })),
    [data, hoveredRow]
  )

  return (
    <Flex column width="100%" height="100%" gap={4} padding={[4, 2]}>
      <GroupBoxes
        data={groupedBoxesData}
        labels={labels}
        renderBoxPopover={renderBoxPopover}
        renderGroupPopover={renderGroupPopover}
      />
      <Flex justifyContent="between">
        <Legend>{id}</Legend>
        <ChartTimeframe
          chartMetadata={chartMetadata}
          showUndefined={showUndefined}
          hoveredX={hoveredX}
          viewBefore={viewBefore}
          chartData={chartData}
        />
      </Flex>
    </Flex>
  )
}

export default Kubernetes
