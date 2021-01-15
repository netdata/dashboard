/* eslint-disable react/prop-types */
// @ts-nocheck
import React from "react"
import { Flex } from "@netdata/netdata-ui"
import Container, { Section, Item } from "./popover"
import ChartOverview from "./chartOverview"
import DateSection from "./dateSection"

const BoxPopover = ({ label, chartMetadata, attributes, viewBefore, viewAfter, ...rest }: any) => {
  const {
    k8s_cluster_id: clusterId,
    k8s_namespace: namespace,
    k8s_controller_name: controllerName,
    k8s_pod_name: podName,
  } = chartMetadata.chartLabels

  return (
    <Container title={label} {...rest}>
      <Flex height="1px" width="100%" background={["gray", "shuttleGray"]} />
      <Section title="Cluster">
        <Item icon="cluster" title="Cluster" secondary={clusterId} />
        <Item icon="services" title="Service" secondary={controllerName} />
        <Item icon="cluster_spaces" title="Namespace" secondary={namespace} />
        <Item icon="pod" title="Pod" secondary={podName} />
      </Section>
      <DateSection after={viewAfter} before={viewBefore} />
      <Section title="Metrics" noBorder>
        {attributes.relatedCharts.map(({ chartMetadata }, index) => (
          <ChartOverview key={chartMetadata.id} attributes={attributes} relatedIndex={index} />
        ))}
      </Section>
    </Container>
  )
}

export default BoxPopover
