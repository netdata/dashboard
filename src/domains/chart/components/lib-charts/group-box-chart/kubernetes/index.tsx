/* eslint-disable comma-dangle */
/* eslint-disable react/prop-types */
// @ts-nocheck
import React, { useMemo } from "react"
import { ChartMetadata } from "domains/chart/chart-types"
// import { Attributes } from "../../../utils/transformDataAttributes"
import GroupBoxes from "domains/chart/components/lib-charts/group-box-chart/groupBoxes"
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
  chartData: { id, groupedBoxes },
  chartMetadata,
  attributes,
  viewAfter,
  viewBefore,
  hoveredRow,
  hoveredX,
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

  const chartData = useMemo(
    () => ({
      ...groupedBoxes,
      data: groupedBoxes.data.map((groupedBox) => {
        const data = getBoxesData(groupedBox, hoveredRow)
        return {
          labels: groupedBox.labels,
          data,
        }
      }),
    }),
    [groupedBoxes, hoveredRow]
  )

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
