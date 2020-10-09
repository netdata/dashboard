import { cond } from "ramda"
import React from "react"
import { ChartsMetadata } from "domains/global/types"
import { ChartWrapper } from "domains/dashboard/components/chart-wrapper"
import { Attributes, ChartsAttributes } from "domains/chart/utils/transformDataAttributes"
import { mapDefaultAggrMethod } from "utils/fill-missing-data"

interface Props {
  charts: ChartsMetadata["charts"]
  duration: number
  host: string
  chartsMetadata: ChartsMetadata
  attributesOverrides?: ChartsAttributes
  nodeIDs: string[]
  commonAttributesOverrides?: Partial<Attributes>
}
export const HeadMain = ({
  charts,
  duration,
  host,
  chartsMetadata,
  attributesOverrides,
  nodeIDs,
  commonAttributesOverrides,
}: Props) => {
  const commonAttributes = {
    host,
    after: -duration,
    forceTimeWindow: true,
    points: duration,
    nodeIDs,
    ...commonAttributesOverrides,
  }

  // todo
  const { colors } = window.NETDATA.themes.current

  return (
    <>
      {charts["system.swap"] && (
        <ChartWrapper
          attributes={{
            ...commonAttributes,
            id: "system.swap",
            appendOptions: "percentage",
            chartLibrary: "easypiechart",
            title: "Used Swap",
            easyPieChartMaxValue: 100,
            width: "9%",
            before: 0,
            colors: "DD4400",
            dimensions: "used",
            units: "%",
            aggrMethod: mapDefaultAggrMethod("%"),
            style={{ marginRight: 10 }}
            chartMetadata={chartsMetadata.charts["system.swap"]}
        }}
        />
      )}


      {charts["system.io"] ? (
        <>
          <ChartWrapper
            attributes={{
              ...commonAttributes,
              id: "system.io",
              chartLibrary: "easypiechart",
              title: "Disk Read",
              width: "11%",
              before: 0,
              unitsCommon: "system.io.mainhead",
              ...(attributesOverrides && attributesOverrides["system.io"]),
              dimensions: "in",
            }}
            style={{ marginRight: 10 }}
            chartMetadata={chartsMetadata.charts["system.io"]}
          />
          <ChartWrapper
            attributes={{
              ...commonAttributes,
              id: "system.io",
              chartLibrary: "easypiechart",
              title: "Disk Write",
              width: "11%",
              before: 0,
              unitsCommon: "system.io.mainhead",
              ...(attributesOverrides && attributesOverrides["system.io"]),
              dimensions: "out",
            }}
            style={{ marginRight: 10 }}
            chartMetadata={chartsMetadata.charts["system.io"]}
          />
        </>
      ) : (charts["system.pgpgio"] && (
        <>
          <ChartWrapper
            attributes={{
              ...commonAttributes,
              id: "system.pgpgio",
              chartLibrary: "easypiechart",
              title: "Disk Read",
              width: "11%",
              before: 0,
              unitsCommon: "system.pgpgio.mainhead",
              ...(attributesOverrides && attributesOverrides["system.pgpgio"]),
              dimensions: "in",
            }}
            style={{ marginRight: 10 }}
            chartMetadata={chartsMetadata.charts["system.pgpgio"]}
          />
          <ChartWrapper
            attributes={{
              ...commonAttributes,
              id: "system.pgpgio",
              chartLibrary: "easypiechart",
              title: "Disk Write",
              width: "11%",
              before: 0,
              unitsCommon: "system.pgpgio.mainhead",
              ...(attributesOverrides && attributesOverrides["system.pgpgio"]),
              dimensions: "out",
            }}
            style={{ marginRight: 10 }}
            chartMetadata={chartsMetadata.charts["system.pgpgio"]}
          />
        </>
      ))}

      {charts["system.cpu"] && (
        <ChartWrapper
          attributes={{
            ...commonAttributes,
            id: "system.cpu",
            chartLibrary: "gauge",
            title: "CPU",
            gaugeMaxValue: 100,
            width: "20%",
            colors: colors[12],
            unitsCommon: "system.pgpgio.mainhead",
            units: "%",
            units: "%",
            aggrMethod: mapDefaultAggrMethod("%"),
          }}
          style={{ marginRight: 10 }}
          chartMetadata={chartsMetadata.charts["system.cpu"]}
        />
      )}


      {cond([
        [() => Boolean(charts["system.net"]), () => (
          <>
            <ChartWrapper
              attributes={{
                ...commonAttributes,
                id: "system.net",
                chartLibrary: "easypiechart",
                title: "Net Inbound",
                width: "11%",
                before: 0,
                unitsCommon: "system.net.mainhead",
                ...(attributesOverrides && attributesOverrides["system.net"]),
                dimensions: "received",
              }}
              style={{ marginRight: 10 }}
              chartMetadata={chartsMetadata.charts["system.net"]}
            />
            <ChartWrapper
              attributes={{
                ...commonAttributes,
                id: "system.net",
                chartLibrary: "easypiechart",
                title: "Net Outbound",
                width: "11%",
                before: 0,
                unitsCommon: "system.net.mainhead",
                ...(attributesOverrides && attributesOverrides["system.net"]),
                dimensions: "sent",
              }}
              style={{ marginRight: 10 }}
              chartMetadata={chartsMetadata.charts["system.net"]}
            />
          </>
        )],
        [() => Boolean(charts["system.ip"]), () => (
          <>
            <ChartWrapper
              attributes={{
                ...commonAttributes,
                id: "system.ip",
                chartLibrary: "easypiechart",
                title: "IP Inbound",
                width: "11%",
                before: 0,
                unitsCommon: "system.ip.mainhead",
                ...(attributesOverrides && attributesOverrides["system.ip"]),
                dimensions: "received",
              }}
              style={{ marginRight: 10 }}
              chartMetadata={chartsMetadata.charts["system.ip"]}
            />
            <ChartWrapper
              attributes={{
                ...commonAttributes,
                id: "system.ip",
                chartLibrary: "easypiechart",
                title: "IP Outbound",
                width: "11%",
                before: 0,
                unitsCommon: "system.ip.mainhead",
                ...(attributesOverrides && attributesOverrides["system.ip"]),
                dimensions: "sent",
              }}
              style={{ marginRight: 10 }}
              chartMetadata={chartsMetadata.charts["system.ip"]}
            />
          </>
        )],
        [() => Boolean(charts["system.ipv4"]), () => (
          <>
            <ChartWrapper
              attributes={{
                ...commonAttributes,
                id: "system.ipv4",
                chartLibrary: "easypiechart",
                title: "IPv4 Inbound",
                width: "11%",
                before: 0,
                unitsCommon: "system.ipv4.mainhead",
                ...(attributesOverrides && attributesOverrides["system.ipv4"]),
                dimensions: "received",
              }}
              style={{ marginRight: 10 }}
              chartMetadata={chartsMetadata.charts["system.ipv4"]}
            />
            <ChartWrapper
              attributes={{
                ...commonAttributes,
                id: "system.ipv4",
                chartLibrary: "easypiechart",
                title: "IPv4 Outbound",
                width: "11%",
                before: 0,
                unitsCommon: "system.ipv4.mainhead",
                ...(attributesOverrides && attributesOverrides["system.ipv4"]),
                dimensions: "sent",
              }}
              style={{ marginRight: 10 }}
              chartMetadata={chartsMetadata.charts["system.ipv4"]}
            />
          </>
        )],
        [() => Boolean(charts["system.ipv6"]), () => (
          <>
            <ChartWrapper
              attributes={{
                ...commonAttributes,
                id: "system.ipv6",
                chartLibrary: "easypiechart",
                title: "IPv6 Inbound",
                width: "11%",
                before: 0,
                unitsCommon: "system.ipv6.mainhead",
                ...(attributesOverrides && attributesOverrides["system.ipv6"]),
                units: "kbps",
                aggrMethod: mapDefaultAggrMethod("kbps"),
                dimensions: "received",
              }}
              style={{ marginRight: 10 }}
              chartMetadata={chartsMetadata.charts["system.ipv6"]}
            />
            <ChartWrapper
              attributes={{
                ...commonAttributes,
                id: "system.ipv6",
                chartLibrary: "easypiechart",
                title: "IPv6 Outbound",
                width: "11%",
                before: 0,
                unitsCommon: "system.ipv6.mainhead",
                ...(attributesOverrides && attributesOverrides["system.ipv6"]),
                dimensions: "sent",
              }}
              style={{ marginRight: 10 }}
              chartMetadata={chartsMetadata.charts["system.ipv6"]}
            />
          </>
        )],
      ])()}

      {charts["system.ram"] && (
        <ChartWrapper
          attributes={{
            ...commonAttributes,
            id: "system.ram",
            appendOptions: "percentage",
            chartLibrary: "easypiechart",
            title: "Used RAM",
            easyPieChartMaxValue: 100,
            width: "9%",
            before: 0,
            colors: colors[7],
            ...(attributesOverrides && attributesOverrides["system.ram"]),
            aggrMethod: mapDefaultAggrMethod("%"),
            dimensions: "used|buffers|active|wired",
            units: "%",
          }}
          style={{ marginRight: 10 }}
          chartMetadata={chartsMetadata.charts["system.ram"]}
        />
      )}
    </>
  )
}
