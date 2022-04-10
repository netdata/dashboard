import React, { useState, useCallback, useEffect } from "react"
import useCloudConnectionStatus from "./use-cloud-connection-status"
import CloudConnectionStatusModal from "./cloud-connection-status-modal"

import { Pill, Flex } from "@netdata/netdata-ui"
import { useSelector } from "react-redux"
import { useRequestRefreshOfAccessMessage } from "hooks/use-user-node-access"
import { selectUserNodeAccess } from "domains/global/selectors"
import { PromoProps } from "@/src/domains/dashboard/components/migration-modal"
import { selectIsCloudEnabled } from "domains/global/selectors"

const CloudConnectionStatus = () => {
  const userNodeAccess = useSelector(selectUserNodeAccess) as PromoProps
  const cloudEnabled = useSelector(selectIsCloudEnabled)

  const [isModalOpen, setModalOpen] = useState(false)
  const cloudConnectionStatusInfo = useCloudConnectionStatus({
    userStatus: userNodeAccess?.userStatus || "UNKNOWN",
    nodeStatus: userNodeAccess?.nodeLiveness || "NOT_LIVE",
    date: "",
  })

  useEffect(() => {
    if (isModalOpen) {
      document.documentElement.style.overflow = "hidden"
    } else {
      document.documentElement.style.overflow = "auto"
    }
  }, [isModalOpen])

  const openModal = useCallback(() => {
    setModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setModalOpen(false)
  }, [])

  const onRefresh = useRequestRefreshOfAccessMessage()

  if (!cloudEnabled) return null

  return (
    <Flex column>
      <Pill
        data-ga={`connection-to-cloud::click-pill::ad`}
        data-testid="header-connection-to-cloud-button"
        onClick={openModal}
        flavour="neutral"
      >
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
