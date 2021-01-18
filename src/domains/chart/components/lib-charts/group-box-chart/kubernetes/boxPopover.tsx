/* eslint-disable object-curly-newline */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
// @ts-nocheck
import React from "react"
import { Flex } from "@netdata/netdata-ui"
import Popover, { Separator, Header } from "./popover"
import Item from "./item"
import Section from "./section"
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
    <Popover gap={3} {...rest}>
      <Header>{label}</Header>
      <Separator />
      <Flex gap={3} overflow={{ vertical: "auto", horizontal: "hidden" }} column>
        <Section title="Cluster">
          <Item icon="cluster" title="Cluster" secondary={clusterId} />
          <Item icon="services" title="Service" secondary={controllerName} />
          <Item icon="cluster_spaces" title="Namespace" secondary={namespace} />
          <Item icon="pod" title="Pod" secondary={podName} />
        </Section>
        <DateSection after={viewAfter} before={viewBefore} />
        <Section title="Metrics" noBorder>
          {attributes.relatedCharts.map(({ chartMetadata: metadata }, index) => (
            <ChartOverview
              key={metadata.id}
              id={`${label}|${attributes.id}|${metadata.id}|overview`}
              attributes={attributes}
              relatedIndex={index}
            />
          ))}
        </Section>
      </Flex>
    </Popover>
  )
}

export default BoxPopover
