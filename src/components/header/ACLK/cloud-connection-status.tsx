import React, { useState, useCallback } from "react"
import useCloudConnectionStatus from "./use-cloud-connection-status"

import { Pill, Flex } from "@netdata/netdata-ui"

const CloudConnectionStatus = () => {
  const [isModalOpen, setModalOpen] = useState(false)
  const openModal = useCallback(() => {
    setModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setModalOpen(false)
  }, [])

  return (
    <Flex>
      <Pill onClick={openModal} flavour="neutral">
        Connection to Cloud
      </Pill>
    </Flex>
  )
}

export default CloudConnectionStatus
