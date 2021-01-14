import React from "react"
import styled from "styled-components"
import { Flex, TextNano } from "@netdata/netdata-ui"

interface LegendProps {
  children?: React.ReactNode
}

const LinearColorScaleBar = styled(Flex).attrs({ width: "120px", height: "12px", round: true })`
  background: linear-gradient(to right, #c6e3f6, #0e9aff);
`

const Legend = ({ children }: LegendProps) => (
  <Flex gap={4} alignItems="center">
    <TextNano strong>{children}</TextNano>
    <Flex gap={2} alignItems="center">
      <TextNano>0%</TextNano>
      <LinearColorScaleBar />
      <TextNano>100%</TextNano>
    </Flex>
    {/* <Flex gap={2} alignItems="center">
      <TextNano strong>Alarms</TextNano>
      <Flex width="12px" height="12px" background="error" round />
    </Flex>
    <Flex gap={2} alignItems="center">
      <TextNano strong>Warnings</TextNano>
      <Flex width="12px" height="12px" background="warning" round />
    </Flex> */}
  </Flex>
)

export default Legend
