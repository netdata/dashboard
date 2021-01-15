/* eslint-disable react/jsx-fragments */
/* eslint-disable react/prop-types */
// @ts-nocheck
import React, { Fragment, useState } from "react"
import { Flex, Button } from "@netdata/netdata-ui"
import styled from "styled-components"
import Container, { Section, Item } from "./popover"
import DateSection from "./dateSection"
import Chart from "./chart"

const Context = ({ chartMetadata, attributes }) => {
  const { getName, nodeIDs } = attributes
  const { k8s_cluster_id: clusterId, k8s_namespace: namespace } = chartMetadata.chartLabels

  return (
    <Fragment>
      <Section title="Parent">
        <Item icon="cluster" title="Cluster" secondary={clusterId} />
      </Section>
      <Section title="Nodes">
        {nodeIDs.map((nodeId) => (
          <Item icon="nodes_hollow" title={getName(nodeId)} />
        ))}
      </Section>
      <Section title="Namespace" noBorder>
        <Item icon="cluster_spaces" title={namespace} />
      </Section>
    </Fragment>
  )
}

const Metrics = ({ attributes, viewBefore, viewAfter }) => {
  return (
    <Fragment>
      <DateSection after={viewAfter} before={viewBefore} />
      <Section title="Metrics" noBorder>
        <Flex gap={3} column>
          {attributes.relatedCharts.map(({ chartMetadata }, index) => (
            <Chart key={chartMetadata.id} attributes={attributes} relatedIndex={index} />
          ))}
        </Flex>
      </Section>
    </Fragment>
  )
}

const TabButton = styled(Button).attrs(({ active }) => ({
  flavour: "borderless",
  neutral: true,
  themeType: "dark",
  className: "btn",
  disabled: active,
}))`
  &&& {
    height: initial;
    width: initial;
    padding: 2px 20px;
    ${({ active }) => active && `border-bottom: 3px solid #fdfdfd;`}
    color: ${({ active }) => (active ? "#FDFDFD" : "#93A3B0")}
  }
`

const Tabs = ({ value, onChange, children }) => {
  return (
    <Flex column gap={5}>
      <Flex border={{ side: "bottom", color: ["gray", "shuttleGray"] }}>
        <TabButton
          label="Context"
          active={value === "context"}
          onClick={() => onChange("context")}
        />
        <TabButton
          label="Metrics"
          active={value === "metrics"}
          onClick={() => onChange("metrics")}
        />
      </Flex>
      <Flex column gap={3} overflow={{ vertical: "auto", horizontal: "hidden" }}>
        {children}
      </Flex>
    </Flex>
  )
}

const GroupPopover = ({ label, attributes, chartMetadata, viewBefore, viewAfter, ...rest }) => {
  const [view, setView] = useState("context")

  return (
    <Container title={label} {...rest}>
      <Tabs value={view} onChange={setView}>
        {view === "context" && <Context chartMetadata={chartMetadata} attributes={attributes} />}
        {view === "metrics" && (
          <Metrics attributes={attributes} viewBefore={viewBefore} viewAfter={viewAfter} />
        )}
      </Tabs>
    </Container>
  )
}

export default GroupPopover
