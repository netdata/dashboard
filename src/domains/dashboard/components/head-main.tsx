import { cond } from "ramda"
import React from "react"
import { ChartsMetadata } from "domains/global/types"
import { ChartWrapper } from "domains/dashboard/components/chart-wrapper"

interface Props {
  charts: ChartsMetadata["charts"]
  duration: number
  host: string
}
export const HeadMain = ({
  charts,
  duration,
  host,
}: Props) => {
  const commonAttributes = {
    after: -duration,
    points: duration,
  }

  // todo
  const { colors } = window.NETDATA.themes.current

  return (
    <>
      {charts["system.swap"] && (
        <ChartWrapper
          attributes={{
            ...commonAttributes,
            host,
            id: "system.swap",
            dimensions: "used",
            appendOptions: "percentage",
            chartLibrary: "easypiechart",
            title: "Used Swap",
            units: "%",
            easyPieChartMaxValue: 100,
            width: "9%",
            before: 0,
            colors: "DD4400",
          }}
          style={{ marginRight: 10 }}
        />
      )}


      {charts["system.io"] ? (
        <>
          <ChartWrapper
            attributes={{
              ...commonAttributes,
              host,
              id: "system.io",
              dimensions: "in",
              chartLibrary: "easypiechart",
              title: "Disk Read",
              width: "11%",
              before: 0,
              unitsCommon: "system.io.mainhead",
            }}
            style={{ marginRight: 10 }}
          />
          <ChartWrapper
            attributes={{
              ...commonAttributes,
              host,
              id: "system.io",
              dimensions: "out",
              chartLibrary: "easypiechart",
              title: "Disk Write",
              width: "11%",
              before: 0,
              unitsCommon: "system.io.mainhead",
            }}
            style={{ marginRight: 10 }}
          />
        </>
      ) : (charts["system.pgpgio"] && (
        <>
          <ChartWrapper
            attributes={{
              ...commonAttributes,
              host,
              id: "system.pgpgio",
              dimensions: "in",
              chartLibrary: "easypiechart",
              title: "Disk Read",
              width: "11%",
              before: 0,
              unitsCommon: "system.pgpgio.mainhead",
            }}
            style={{ marginRight: 10 }}
          />
          <ChartWrapper
            attributes={{
              ...commonAttributes,
              host,
              id: "system.pgpgio",
              dimensions: "out",
              chartLibrary: "easypiechart",
              title: "Disk Write",
              width: "11%",
              before: 0,
              unitsCommon: "system.pgpgio.mainhead",
            }}
            style={{ marginRight: 10 }}
          />
        </>
      ))}

      {charts["system.cpu"] && (
        <ChartWrapper
          attributes={{
            ...commonAttributes,
            host,
            id: "system.cpu",
            chartLibrary: "gauge",
            title: "CPU",
            units: "%",
            gaugeMaxValue: 100,
            width: "20%",
            colors: colors[12],
            unitsCommon: "system.pgpgio.mainhead",
          }}
          style={{ marginRight: 10 }}
        />
      )}


      {cond([
        [() => Boolean(charts["system.net"]), () => (
          <>
            <ChartWrapper
              attributes={{
                ...commonAttributes,
                host,
                id: "system.net",
                dimensions: "received",
                chartLibrary: "easypiechart",
                title: "Net Inbound",
                width: "11%",
                before: 0,
                unitsCommon: "system.net.mainhead",
              }}
              style={{ marginRight: 10 }}
            />
            <ChartWrapper
              attributes={{
                ...commonAttributes,
                host,
                id: "system.net",
                dimensions: "sent",
                chartLibrary: "easypiechart",
                title: "Net Outbound",
                width: "11%",
                before: 0,
                unitsCommon: "system.net.mainhead",
              }}
              style={{ marginRight: 10 }}
            />
          </>
        )],
        [() => Boolean(charts["system.ip"]), () => (
          <>
            <ChartWrapper
              attributes={{
                ...commonAttributes,
                host,
                id: "system.ip",
                dimensions: "received",
                chartLibrary: "easypiechart",
                title: "IP Inbound",
                width: "11%",
                before: 0,
                unitsCommon: "system.ip.mainhead",
              }}
              style={{ marginRight: 10 }}
            />
            <ChartWrapper
              attributes={{
                ...commonAttributes,
                host,
                id: "system.ip",
                dimensions: "sent",
                chartLibrary: "easypiechart",
                title: "IP Outbound",
                width: "11%",
                before: 0,
                unitsCommon: "system.ip.mainhead",
              }}
              style={{ marginRight: 10 }}
            />
          </>
        )],
        [() => Boolean(charts["system.ipv4"]), () => (
          <>
            <ChartWrapper
              attributes={{
                ...commonAttributes,
                host,
                id: "system.ipv4",
                dimensions: "received",
                chartLibrary: "easypiechart",
                title: "IPv4 Inbound",
                width: "11%",
                before: 0,
                unitsCommon: "system.ipv4.mainhead",
              }}
              style={{ marginRight: 10 }}
            />
            <ChartWrapper
              attributes={{
                ...commonAttributes,
                host,
                id: "system.ipv4",
                dimensions: "sent",
                chartLibrary: "easypiechart",
                title: "IPv4 Outbound",
                width: "11%",
                before: 0,
                unitsCommon: "system.ipv4.mainhead",
              }}
              style={{ marginRight: 10 }}
            />
          </>
        )],
        [() => Boolean(charts["system.ipv6"]), () => (
          <>
            <ChartWrapper
              attributes={{
                ...commonAttributes,
                host,
                id: "system.ipv6",
                dimensions: "received",
                chartLibrary: "easypiechart",
                title: "IPv6 Inbound",
                units: "kbps",
                width: "11%",
                before: 0,
                unitsCommon: "system.ipv6.mainhead",
              }}
              style={{ marginRight: 10 }}
            />
            <ChartWrapper
              attributes={{
                ...commonAttributes,
                host,
                id: "system.ipv6",
                dimensions: "sent",
                chartLibrary: "easypiechart",
                title: "IPv6 Outbound",
                width: "11%",
                before: 0,
                unitsCommon: "system.ipv6.mainhead",
              }}
              style={{ marginRight: 10 }}
            />
          </>
        )],
      ])()}

      {charts["system.ram"] && (
        <ChartWrapper
          attributes={{
            ...commonAttributes,
            host,
            id: "system.ram",
            dimensions: "used|buffers|active|wired",
            appendOptions: "percentage",
            chartLibrary: "easypiechart",
            title: "Used RAM",
            units: "%",
            easyPieChartMaxValue: 100,
            width: "9%",
            before: 0,
            colors: colors[7],
          }}
          style={{ marginRight: 10 }}
        />
      )}
    </>
  )
}
