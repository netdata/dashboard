import React, { useMemo } from "react"
import { useSelector } from "store/redux-separate-context"
import { selectActiveAlarms } from "domains/global/selectors"
import Item from "./item"
import Pill from "./pill"
import Tooltip from "@/src/components/tooltips"

const pillProps = {
  "data-toggle": "modal",
  "data-target": "#alarmsModal",
}

const Alarms = () => {
  const activeAlarms = useSelector(selectActiveAlarms)

  const alarms = useMemo(() => (activeAlarms ? Object.values(activeAlarms.alarms) : []), [
    activeAlarms,
  ])

  const { critical, warning } = useMemo(
    () =>
      alarms.reduce(
        (acc, { status }) => {
          if (status === "CRITICAL") acc.critical = acc.critical + 1
          if (status === "WARNING") acc.warning = acc.warning + 1
          return acc
        },
        { critical: 0, warning: 0 }
      ),
    [alarms]
  )

  return (
    <Item icon="alarm">
      <Tooltip
        content={
          critical
            ? `${critical} critical alert${critical.length > 1 ? "s" : ""}`
            : "No critical alerts"
        }
        align="bottom"
        plain
      >
        <Pill background="error" hollow {...pillProps}>
          {critical}
        </Pill>
      </Tooltip>
      <Tooltip
        content={
          warning ? `${warning} warning alert${warning.length > 1 ? "s" : ""}` : "No warning alerts"
        }
        align="bottom"
        plain
      >
        <Pill background="warning" hollow {...pillProps}>
          {warning}
        </Pill>
      </Tooltip>
    </Item>
  )
}

export default Alarms
