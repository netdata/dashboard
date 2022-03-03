import React, { useMemo } from "react"
import { CloudConnectionProps, UserStatus } from "./types"

import { Text } from "@netdata/netdata-ui"

type MigrationModalActions = {
  text: string
}

type ConnectionModalStatusContent = {
  title: string
  text: {
    header: (props?: any) => React.ReactElement
    bullets?: Array<string | ((props?: any) => React.ReactNode)>
    footer?: () => React.ReactElement
  }
  CTA1: MigrationModalActions
}

export const makeCloudConnectionStatusInfo = ({
  nodeStatus,
  userStatus,
  date,
}: CloudConnectionProps): ConnectionModalStatusContent => ({
  title: "Netdata Cloud connection status",
  text: {
    header: () => {
      return (
        <Text strong>
          This node is currently {nodeStatus === "Connected" ? "Connected" : "Not connected"} to
          Netdata Cloud
        </Text>
      )
    },
    bullets:
      nodeStatus === "Not_Connected"
        ? [
            `The node lost its Netdata Cloud connection at ${date}`,
            "To troubleshoot Netdata Cloud connection issues, please follow this guide. (only shows on Not Connected)",
          ]
        : [],
    footer: () => (
      <Text>
        You are{" "}
        {userStatus === UserStatus.Logged_In
          ? "Logged In"
          : userStatus === UserStatus.Logged_Out
          ? "Logged out"
          : "Not signed-up"}
        to Netdata Cloud
      </Text>
    ),
  },
  CTA1: {
    text: "Take me to Netdata Cloud",
  },
})

const useCloudConnectionStatus = ({ userStatus, nodeStatus, date }: CloudConnectionProps) => {
  const cloudConnectionStatusInfo = useMemo<ConnectionModalStatusContent>(() => {
    return makeCloudConnectionStatusInfo({ userStatus, nodeStatus, date })
  }, [userStatus, nodeStatus, date])

  return cloudConnectionStatusInfo
}

export default useCloudConnectionStatus
