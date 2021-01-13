/* eslint-disable react/prop-types */
// @ts-nocheck
import React, { useMemo } from "react"
import { H5, H6, Text, Flex, Icon } from "@netdata/netdata-ui"
import styled from "styled-components"
import Container from "@netdata/netdata-ui/lib/components/drops/tooltip/container"
import { useDateTime } from "utils/date-time"
import { ChartMetadata } from "domains/chart/chart-types"
import { Attributes } from "../../../utils/transformDataAttributes"
import GroupBoxes from "./groupBoxes"

interface Props {
  chartData: any
  attributes: Attributes
  chartMetadata: ChartMetadata
}

const Section = ({ title, children }) => {
  return (
    <Flex gap={3} column>
      <H6 color="border">{title}</H6>
      <Flex gap={2} column>
        {children}
      </Flex>
    </Flex>
  )
}

const Item = ({ icon, title, secondary }) => {
  return (
    <Flex gap={1} alignItems="start">
      <Flex width="22px" height="22px">
        <Icon name={icon} color="text" margin={[0, 1, 0, 0]} width="22px" height="22px" />
      </Flex>
      <Text>{title}</Text>
      {secondary && (
        <Text color="border" wordBreak="break-all">
          {secondary}
        </Text>
      )}
    </Flex>
  )
}

const StyledContainer = styled(Container)`
  background: rgba(18, 36, 50, 0.9);
`

// const GroupTooltip = ({ attributes, groupedBoxes, groupIndex, index, chartMetadata }) => {
//   const { getName, nodeIDs } = attributes
//   const label = groupedBoxes.data[groupIndex].labels[index]
//   const { k8s_cluster_id: clusterId, k8s_namespace: namespace } = chartMetadata.chartLabels
//   return (
//     <StyledContainer align="top" padding={[2, 4]} width="320px" height={{ max: "420px" }} gap={6}>
//       <H5>{label}</H5>
//       <Flex column gap={7} overflow={{ vertical: "auto" }}>
//         <Section title="Parent">
//           <Item icon="cluster" title="Cluster" secondary={clusterId} />
//         </Section>
//         <Section title="Nodes">
//           {nodeIDs.map((nodeId) => (
//             <Item icon="nodes_hollow" title={getName(nodeId)} />
//           ))}
//         </Section>
//         <Section title="Namespace">
//           <Item icon="cluster_spaces" title={namespace} />
//         </Section>
//       </Flex>
//     </StyledContainer>
//   )
// }

const BoxTooltip = ({ label, chartMetadata, viewBefore, viewAfter, ...rest }: any) => {
  const { localeDateString, localeTimeString } = useDateTime()
  const {
    k8s_cluster_id: clusterId,
    k8s_namespace: namespace,
    k8s_controller_name: controllerName,
    k8s_pod_name: podName,
  } = chartMetadata.chartLabels

  return (
    <StyledContainer
      align="top"
      padding={[3, 4]}
      width="320px"
      height={{ max: "420px" }}
      gap={6}
      {...rest}
    >
      <H5 wordBreak="break-all">{label}</H5>
      <Flex column gap={7} overflow={{ vertical: "auto" }}>
        <Section title="Cluster">
          <Item icon="cluster" title="Cluster" secondary={clusterId} />
          <Item icon="services" title="Service" secondary={controllerName} />
          <Item icon="cluster_spaces" title="Namespace" secondary={namespace} />
          <Item icon="pod" title="Pod" secondary={podName} />
        </Section>
        <Section title="Time">
          <Item
            icon="around_clock"
            title="From"
            secondary={`${localeDateString(viewAfter)} | ${localeTimeString(viewAfter)}`}
          />
          <Item
            icon="around_clock"
            title="To"
            secondary={`${localeDateString(viewBefore)} | ${localeTimeString(viewBefore)}`}
          />
        </Section>
      </Flex>
    </StyledContainer>
  )
}

const Kubernetes = ({
  chartData: { id, groupedBoxes },
  chartMetadata,
  attributes,
  viewAfter,
  viewBefore,
}: any) => {
  const renderTooltip = ({ group, groupIndex, index }, props) => {
    const label = groupedBoxes.data[groupIndex].labels[index]
    return (
      <BoxTooltip
        label={label}
        chartMetadata={chartMetadata}
        viewBefore={viewBefore}
        viewAfter={viewAfter}
        {...props}
      />
    )
  }

  const chartData = useMemo(() => {
    return {
      ...groupedBoxes,
      data: groupedBoxes.data.map(({ labels, postAggregatedData }) => ({
        labels,
        data: postAggregatedData,
      })),
    }
  }, [groupedBoxes])

  return <GroupBoxes id={id} chartData={chartData} renderTooltip={renderTooltip} />
}

export default Kubernetes
