import React, { useState } from "react"

import {
  MigrationModal,
  useMigrationModal,
} from "@/src/domains/dashboard/components/migration-modal"

const MigrationManager = () => {
  const [isModalOpen, setModalOpen] = useState(true)
  const { migrationModalPromoInfo, setUserPrefrence } = useMigrationModal({
    userStatus: "LOGGED_IN",
    nodeClaimedStatus: undefined,
    userNodeAccess: "ACCESS_OK",
    nodeLiveness: "LIVE",
  })

  const closeModal = () => {
    setModalOpen(false)
  }

  if (migrationModalPromoInfo && isModalOpen)
    return (
      <MigrationModal
        migrationModalPromoInfo={migrationModalPromoInfo}
        setUserPrefrence={setUserPrefrence}
        closeModal={closeModal}
      ></MigrationModal>
    )

  return null
}

export default MigrationManager
