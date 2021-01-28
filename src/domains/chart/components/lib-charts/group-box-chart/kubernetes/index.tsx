/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable comma-dangle */
/* eslint-disable react/prop-types */
// @ts-nocheck
import React, { useMemo, useEffect } from "react"
import { Flex } from "@netdata/netdata-ui"
import { usePrevious } from "react-use"
import { ChartMetadata } from "domains/chart/chart-types"
// import { Attributes } from "../../../utils/transformDataAttributes"
import { ChartTimeframe } from "domains/chart/components/chart-legend-bottom"
import GroupBoxes from "domains/chart/components/lib-charts/group-box-chart/groupBoxes"
import Legend from "domains/chart/components/lib-charts/group-box-chart/legend"
import transform from "./transform"
import Popover from "./popover"

interface Props {
  chartData: any
  attributes: Attributes
  chartMetadata: ChartMetadata
  hoveredRow: number
  hoveredX: number | null
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
  const { filteredRows } = attributes
  const { data: groupBoxData, labels, chartLabels } = useMemo(
    () => transform(chartData, filteredRows),
    [filteredRows, chartData]
  )

  const {
    id,
    result: { data },
  } = chartData

  const renderBoxPopover = ({ groupIndex, index, align }) => {
    const postGroupLabel = groupBoxData[groupIndex].labels[index]
    return (
      <Popover
        align={align}
        title={postGroupLabel}
        groupLabel={labels[groupIndex]}
        postGroupLabel={postGroupLabel}
        chartLabels={groupBoxData[groupIndex].chartLabels[index]}
        attributes={attributes}
        viewBefore={viewBefore}
        viewAfter={viewAfter}
      />
    )
  }

  const renderGroupPopover = ({ groupIndex, align }) => {
    const label = labels[groupIndex]
    return (
      <Popover
        align={align}
        title={label}
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
          hoveredRow === -1 || hoveredRow > data.length
            ? groupedBox.postAggregated
            : groupedBox.indexes.map((index) => data[hoveredRow][index]) || [],
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
