/* eslint-disable comma-dangle */
/* eslint-disable object-curly-newline */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
// @ts-nocheck
import React from "react"
import { Flex } from "@netdata/netdata-ui"
import Item from "./item"
import Section from "./section"
import labels, { labelIds, getLabelValues } from "./labels"

const LabelsSection = ({ labelId, attributes, chartMetadata, onExpand, ...rest }) => {
  const { title, icon } = labels[labelId]

  // todo: will be fixed once the backend returns an array
  const items = getLabelValues(chartMetadata, attributes, labelId)
  const sliced = items.slice(0, 3)
  const expandable = items.length > 3

  return (
    <Section title={`${title} (${items.length})`} onExpand={expandable && onExpand} {...rest}>
      {sliced.map((item) => (
        <Item key={item} icon={icon} title={item} />
      ))}
    </Section>
  )
}

const LabelSection = ({ labelId, chartMetadata }) => {
  const { icon, title } = labels[labelId]
  const label = chartMetadata.chartLabels[labelId]
  return (
    <Section title={title}>
      <Item icon={icon} title={label} />
    </Section>
  )
}

const Context = ({ attributes, onExpand }) => {
  const { chartMetadata: selectedChartMetadata } = attributes.relatedCharts.find(
    (r) => r.chartMetadata.id === attributes.selectedChart
  )

  return (
    <Flex gap={3} column>
      <LabelSection labelId="k8s_cluster_id" chartMetadata={selectedChartMetadata} />
      {labelIds.map((labelId, index) => (
        <LabelsSection
          key={labelId}
          labelId={labelId}
          attributes={attributes}
          chartMetadata={selectedChartMetadata}
          onExpand={() => onExpand(labelId)}
          noBorder={index === labelIds.length - 1}
        />
      ))}
    </Flex>
  )
}

export default Context
