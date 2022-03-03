import React, { useState, useCallback } from "react"
import useCloudConnectionStatus from "./use-cloud-connection-status"
import CloudConnectionStatusModal from "./cloud-connection-status-modal"

import { Pill, Flex } from "@netdata/netdata-ui"
import { UserStatus } from "./types"

const CloudConnectionStatus = () => {
  const [isModalOpen, setModalOpen] = useState(false)
  const cloudConnectionStatusInfo = useCloudConnectionStatus({
    userStatus: UserStatus.Logged_In,
    nodeStatus: "Not_Connected",
    date: "Monday May 22th",
  })
  const openModal = useCallback(() => {
    setModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setModalOpen(false)
  }, [])

  return (
    <Flex column>
      <Pill onClick={openModal} flavour="neutral">
        Connection to Cloud
      </Pill>
      {isModalOpen && (
        <CloudConnectionStatusModal
          {...cloudConnectionStatusInfo}
          isCTA1Disabled={false}
          closeModal={closeModal}
        />
      )}
    </Flex>
  )
}

export default CloudConnectionStatus
