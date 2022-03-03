import React, { useMemo } from "react"
import { CloudConnectionProps, UserStatus, ConnectionModalStatusContent } from "./types"

import { Text } from "@netdata/netdata-ui"

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
