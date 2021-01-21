/* eslint-disable object-curly-newline */
/* eslint-disable react/prop-types */
// @ts-nocheck
import React from "react"
import { Flex } from "@netdata/netdata-ui"
import Section from "./section"
import Chart from "./chart"
import DateSection from "./dateSection"

const Metrics = ({ label, attributes, viewAfter, viewBefore }) => (
  <Flex gap={3} column width="100%">
    <DateSection after={viewAfter} before={viewBefore} />
    <Section title="Metrics" noBorder>
      <Flex gap={3} column>
        {attributes.relatedCharts.map(({ chartMetadata }, index) => (
          <Chart
            key={chartMetadata.id}
            id={`${label}|${attributes.id}|${chartMetadata.id}`}
            attributes={attributes}
            relatedIndex={index}
            label={label}
          />
        ))}
      </Flex>
    </Section>
  </Flex>
)

export default Metrics
