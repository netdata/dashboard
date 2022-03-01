import React, { useState } from "react"
import { useLocalStorage } from "react-use"

import {
  MigrationModal,
  useMigrationModal,
} from "@/src/domains/dashboard/components/migration-modal"

const MigrationManager = () => {
  const [isModalOpen, setModalOpen] = useState(true)
  const { migrationModalPromoInfo, setUserPrefrence } = useMigrationModal({
    userStatus: "UNKNOWN",
    nodeClaimedStatus: "NOT_CLAIMED",
    userNodeAccess: undefined,
    nodeLiveness: undefined,
  })

  const [hasPromoSelectionSaved, savePromoRemindMeSelection] = useLocalStorage(
    migrationModalPromoInfo.tickBoxOption.prefrenceID
  )

  const closeModal = () => {
    setModalOpen(false)
  }

  if (migrationModalPromoInfo && isModalOpen && !hasPromoSelectionSaved)
    return (
      <MigrationModal
        savePromoRemindMeSelection={savePromoRemindMeSelection}
        migrationModalPromoInfo={migrationModalPromoInfo}
        setUserPrefrence={setUserPrefrence}
        closeModal={closeModal}
      ></MigrationModal>
    )

  return null
}

export default MigrationManager
