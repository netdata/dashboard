/* eslint-disable no-param-reassign */
/* eslint-disable comma-dangle */
/* eslint-disable object-curly-newline */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
// @ts-nocheck
import React, { memo } from "react"
import { Flex } from "@netdata/netdata-ui"
import Item from "./item"
import Section from "./section"
import getLabel, { labelIds } from "./getLabel"

const LabelsSection = ({ labelId, items, onExpand, ...rest }) => {
  const { title, icon } = getLabel(labelId)
  const sliced = items.slice(0, 3)
  const expandable = items.length > 3

  const text = expandable ? `${title} (${items.length})` : title
  return (
    <Section title={text} onExpand={expandable && onExpand} {...rest}>
      {sliced.map((item) => (
        <Item key={item} icon={icon} title={item} />
      ))}
    </Section>
  )
}

const getLabelIds = (chartLabels) => {
  chartLabels = { ...chartLabels }
  const predefinedLabelIds = labelIds.reduce((acc, labelId) => {
    if (!(labelId in chartLabels)) return acc

    delete chartLabels[labelId]
    return [...acc, labelId]
  }, [])

  return [...predefinedLabelIds, ...Object.keys(chartLabels)]
}

const Context = ({ chartLabels, onExpand }) => {
  const ids = getLabelIds(chartLabels)

  return (
    <Flex gap={3} column width="100%" data-testid="k8sPopoverContext">
      {ids.map((id, index) => (
        <LabelsSection
          key={id}
          labelId={id}
          items={chartLabels[id]}
          onExpand={() => onExpand(id)}
          noBorder={index === ids.length - 1}
        />
      ))}
    </Flex>
  )
}

export default memo(Context)
