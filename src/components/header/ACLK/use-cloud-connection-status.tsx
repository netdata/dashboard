import React, { useMemo } from "react"
import { CloudConnectionProps, UserStatus, ConnectionModalStatusContent } from "./types"
import Anchor from "@/src/components/anchor"

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
        <Text>
          This node is currently{" "}
          <Text strong>{nodeStatus === "Connected" ? "Connected" : "Not Connected"}</Text> to
          Netdata Cloud
        </Text>
      )
    },
    bullets:
      nodeStatus === "Not_Connected"
        ? [
            `The node lost its Netdata Cloud connection at ${date}`,
            () => (
              <Text>
                To troubleshoot Netdata Cloud connection issues, please follow{" "}
                <Anchor
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://learn.netdata.cloud/docs/agent/claim#troubleshooting"
                >
                  this guide
                </Anchor>
                .
              </Text>
            ),
          ]
        : [],
    footer: () => (
      <Text>
        You are{" "}
        <Text strong>
          {userStatus === UserStatus.Logged_In
            ? "Logged In"
            : userStatus === UserStatus.Expired_Login
            ? "Logged out"
            : "Not signed-up"}
        </Text>{" "}
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
