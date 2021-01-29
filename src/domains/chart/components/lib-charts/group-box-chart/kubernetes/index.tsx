/* eslint-disable arrow-body-style */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable comma-dangle */
/* eslint-disable react/prop-types */
// @ts-nocheck
import React, { useMemo } from "react"
import { Flex } from "@netdata/netdata-ui"
import { ChartMetadata } from "domains/chart/chart-types"
import { Attributes } from "domains/chart/utils/transformDataAttributes.ts"
import { ChartTimeframe } from "domains/chart/components/chart-legend-bottom"
import GroupBoxes from "domains/chart/components/lib-charts/group-box-chart/groupBoxes"
import Legend from "domains/chart/components/lib-charts/group-box-chart/legend"
import getLabel from "./getLabel"
import transform from "./transform"
import Popover from "./popover"

interface Props {
  chartData: any
  chartMetadata: ChartMetadata
  attributes: Attributes
  viewAfter: number
  viewBefore: number
  hoveredRow: number
  hoveredX: number | null
  showUndefined: boolean
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
}: Props) => {
  const { filteredRows } = attributes
  const { data: groupBoxData, labels, chartLabels } = useMemo(
    () => transform(chartData, filteredRows),
    [filteredRows, chartData]
  )

  const {
    id,
    result: { data },
    groupBy,
    postGroupBy,
  } = chartData

  const renderBoxPopover = ({ groupIndex, index, align }) => {
    const label = groupBoxData[groupIndex].labels[index]
    const { title } = getLabel(postGroupBy)

    return (
      <Popover
        align={align}
        title={`${title}: ${label}`}
        groupLabel={labels[groupIndex]}
        postGroupLabel={label}
        chartLabels={groupBoxData[groupIndex].chartLabels[index]}
        attributes={attributes}
        viewBefore={viewBefore}
        viewAfter={viewAfter}
      />
    )
  }

  const renderGroupPopover = ({ groupIndex, align }) => {
    const label = labels[groupIndex]
    const { title } = getLabel(groupBy)

    return (
      <Popover
        align={align}
        title={`${title}: ${label}`}
        groupLabel={label}
        chartLabels={chartLabels[groupIndex]}
        attributes={attributes}
        viewBefore={viewBefore}
        viewAfter={viewAfter}
      />
    )
  }

  const groupedBoxesData = useMemo(() => {
    return groupBoxData.map((groupedBox) => {
      return {
        labels: groupedBox.labels,
        data:
          hoveredRow === -1 || hoveredRow > data.length || !(hoveredRow in data)
            ? groupedBox.postAggregated
            : groupedBox.indexes.map((index) => data[hoveredRow][index + 1]) || [],
      }
    })
  }, [data, groupBoxData, hoveredRow])

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
