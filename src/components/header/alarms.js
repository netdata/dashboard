import React, { useMemo } from "react"
import { Button } from "@netdata/netdata-ui"
import { useSelector } from "store/redux-separate-context"
import { selectActiveAlarms } from "domains/global/selectors"
import Item from "./item"
import Pill from "./pill"

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
      <Pill background="error" color="bright" data-toggle="modal" data-target="#alarmsModal">
        {critical}
      </Pill>
      <Pill background="warning" color="tooltip" data-toggle="modal" data-target="#alarmsModal">
        {warning}
      </Pill>
    </Item>
  )
}

export default Alarms
