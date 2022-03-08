import React, { useState, useCallback } from "react"
import useCloudConnectionStatus from "./use-cloud-connection-status"
import CloudConnectionStatusModal from "./cloud-connection-status-modal"

import { Pill, Flex } from "@netdata/netdata-ui"
import { useSelector } from "react-redux"
import { selectUserNodeAccess } from "domains/global/selectors"
import { PromoProps } from "@/src/domains/dashboard/components/migration-modal"

const CloudConnectionStatus = () => {
  const userNodeAccess = useSelector(selectUserNodeAccess) as PromoProps

  const [isModalOpen, setModalOpen] = useState(false)
  const cloudConnectionStatusInfo = useCloudConnectionStatus({
    userStatus: userNodeAccess?.userStatus || "UNKNOWN",
    nodeStatus: userNodeAccess?.nodeLiveness || "NOT_LIVE",
    date: "",
  })

  const openModal = useCallback(() => {
    setModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setModalOpen(false)
  }, [])

  const onRefresh = useCallback(() => {
    console.log("now refreshing")
  }, [])

  return (
    <Flex column>
      <Pill onClick={openModal} flavour="neutral">
        Connection to Cloud
      </Pill>
      {isModalOpen && (
        <CloudConnectionStatusModal
          {...cloudConnectionStatusInfo}
          isCTA1Disabled={userNodeAccess?.nodeLiveness !== "LIVE"}
          closeModal={closeModal}
          onRefresh={onRefresh}
        />
      )}
    </Flex>
  )
}

export default CloudConnectionStatus
