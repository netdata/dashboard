import { cond } from "ramda"
import React from "react"
import { ChartsMetadata } from "domains/global/types"
import { ChartWrapper } from "domains/dashboard/components/chart-wrapper"
import { Attributes } from "domains/chart/utils/transformDataAttributes"
import { mapDefaultAggrMethod } from "utils/fill-missing-data"

interface Props {
  charts: ChartsMetadata["charts"]
  duration: number
  host: string
  chartsMetadata: ChartsMetadata
  nodeIDs: string[]
  commonAttributesOverrides?: Partial<Attributes>
}
export const HeadMain = ({
  charts,
  duration,
  host,
  chartsMetadata,
  nodeIDs,
  commonAttributesOverrides,
}: Props) => {
  const commonAttributes = {
    host,
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
            colors: "DD4400",
            dimensions: "used",
            units: "%",
            aggrMethod: mapDefaultAggrMethod("%"),
          }}
          style={{ marginRight: 10 }}
          chartMetadata={chartsMetadata.charts["system.swap"]}
        />
      )}


      {charts["system.io"] ? (
        <>
          <ChartWrapper
            attributes={{
              ...commonAttributes,
              id: "system.io",
              dimensions: "in",
              chartLibrary: "easypiechart",
              title: "Disk Read",
              width: "11%",
              unitsCommon: "system.io.mainhead",
              aggrMethod: mapDefaultAggrMethod("kbps"),
            }}
            style={{ marginRight: 10 }}
            chartMetadata={chartsMetadata.charts["system.io"]}
          />
          <ChartWrapper
            attributes={{
              ...commonAttributes,
              id: "system.io",
              dimensions: "out",
              chartLibrary: "easypiechart",
              title: "Disk Write",
              width: "11%",
              unitsCommon: "system.io.mainhead",
              aggrMethod: mapDefaultAggrMethod("kbps"),
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
              dimensions: "in",
              chartLibrary: "easypiechart",
              title: "Disk Read",
              width: "11%",
              unitsCommon: "system.pgpgio.mainhead",
              aggrMethod: mapDefaultAggrMethod("KiB/s"),
            }}
            style={{ marginRight: 10 }}
            chartMetadata={chartsMetadata.charts["system.pgpgio"]}
          />
          <ChartWrapper
            attributes={{
              ...commonAttributes,
              id: "system.pgpgio",
              dimensions: "out",
              chartLibrary: "easypiechart",
              title: "Disk Write",
              width: "11%",
              unitsCommon: "system.pgpgio.mainhead",
              aggrMethod: mapDefaultAggrMethod("KiB/s"),
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
                dimensions: "received",
                chartLibrary: "easypiechart",
                title: "Net Inbound",
                width: "11%",
                unitsCommon: "system.net.mainhead",
                aggrMethod: mapDefaultAggrMethod("kbps"),
              }}
              style={{ marginRight: 10 }}
              chartMetadata={chartsMetadata.charts["system.net"]}
            />
            <ChartWrapper
              attributes={{
                ...commonAttributes,
                id: "system.net",
                dimensions: "sent",
                chartLibrary: "easypiechart",
                title: "Net Outbound",
                width: "11%",
                unitsCommon: "system.net.mainhead",
                aggrMethod: mapDefaultAggrMethod("kbps"),
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
                dimensions: "received",
                chartLibrary: "easypiechart",
                title: "IP Inbound",
                width: "11%",
                unitsCommon: "system.ip.mainhead",
                aggrMethod: mapDefaultAggrMethod("kbps"),
              }}
              style={{ marginRight: 10 }}
              chartMetadata={chartsMetadata.charts["system.ip"]}
            />
            <ChartWrapper
              attributes={{
                ...commonAttributes,
                id: "system.ip",
                dimensions: "sent",
                chartLibrary: "easypiechart",
                title: "IP Outbound",
                width: "11%",
                unitsCommon: "system.ip.mainhead",
                aggrMethod: mapDefaultAggrMethod("kbps"),
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
                dimensions: "received",
                chartLibrary: "easypiechart",
                title: "IPv4 Inbound",
                width: "11%",
                unitsCommon: "system.ipv4.mainhead",
                aggrMethod: mapDefaultAggrMethod("kbps"),
              }}
              style={{ marginRight: 10 }}
              chartMetadata={chartsMetadata.charts["system.ipv4"]}
            />
            <ChartWrapper
              attributes={{
                ...commonAttributes,
                id: "system.ipv4",
                dimensions: "sent",
                chartLibrary: "easypiechart",
                title: "IPv4 Outbound",
                width: "11%",
                unitsCommon: "system.ipv4.mainhead",
                aggrMethod: mapDefaultAggrMethod("kbps"),
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
                dimensions: "received",
                chartLibrary: "easypiechart",
                title: "IPv6 Inbound",
                width: "11%",
                unitsCommon: "system.ipv6.mainhead",
                aggrMethod: mapDefaultAggrMethod("kbps"),
              }}
              style={{ marginRight: 10 }}
              chartMetadata={chartsMetadata.charts["system.ipv6"]}
            />
            <ChartWrapper
              attributes={{
                ...commonAttributes,
                id: "system.ipv6",
                dimensions: "sent",
                chartLibrary: "easypiechart",
                title: "IPv6 Outbound",
                width: "11%",
                unitsCommon: "system.ipv6.mainhead",
                aggrMethod: mapDefaultAggrMethod("kbps"),
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
            dimensions: "used|buffers|active|wired",
            appendOptions: "percentage",
            chartLibrary: "easypiechart",
            title: "Used RAM",
            easyPieChartMaxValue: 100,
            width: "9%",
            colors: colors[7],
            units: "%",
            aggrMethod: mapDefaultAggrMethod("%"),
          }}
          style={{ marginRight: 10 }}
          chartMetadata={chartsMetadata.charts["system.ram"]}
        />
      )}
    </>
  )
}
