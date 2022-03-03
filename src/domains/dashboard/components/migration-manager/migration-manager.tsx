import React, { useState, useEffect } from "react"
import { useLocalStorage } from "react-use"

import {
  MigrationModal,
  useMigrationModal,
  PromoProps,
  goToCloud,
  goToAgentDashboard,
} from "@/src/domains/dashboard/components/migration-modal"

const PROMO_SIGN_UP_CLOUD: PromoProps = { userStatus: "UNKNOWN", nodeClaimedStatus: "NOT_CLAIMED" } //CLOUD
const PROMO_SIGN_IN_CLOUD: PromoProps = { userStatus: "UNKNOWN", nodeClaimedStatus: "CLAIMED" } //CLOUD
const PROMO_IVNITED_TO_SPACE: PromoProps = {
  userStatus: "LOGGED_IN",
  nodeClaimedStatus: "CLAIMED",
  userNodeAccess: "NO_ACCESS",
} //CLOUD

const PROMO_CLAIM_NODE: PromoProps = { userStatus: "LOGGED_IN", nodeClaimedStatus: "NOT_CLAIMED" } //CLOUD
const PROMO_TO_USE_NEW_DASHBAORD: PromoProps = {
  userStatus: "LOGGED_IN",
  nodeLiveness: "LIVE",
  userNodeAccess: "ACCESS_OK",
} //UNDEFIND

const FALLBACK_TO_AGENT: PromoProps = {
  userStatus: "LOGGED_IN",
  nodeLiveness: "NOT_LIVE",
  userNodeAccess: "ACCESS_OK",
  nodeClaimedStatus: "CLAIMED",
} //CLOUD

const NO_INFO_FALLBACK_TO_AGENT: PromoProps = {
  userStatus: undefined,
  nodeLiveness: undefined,
  userNodeAccess: undefined,
  nodeClaimedStatus: undefined,
} //CLOUD

const GO_TO_CLOUD: PromoProps = {
  userStatus: "LOGGED_IN",
  nodeLiveness: "LIVE",
  userNodeAccess: "ACCESS_OK",
  nodeClaimedStatus: "CLAIMED",
} //CLOUD

const MigrationManager = () => {
  const [isModalOpen, setModalOpen] = useState(true)
  const { migrationModalPromoInfo, setUserPrefrence, userSavedPreference } = useMigrationModal({
    ...PROMO_TO_USE_NEW_DASHBAORD,
  })

  const prefrenceID = migrationModalPromoInfo?.tickBoxOption.prefrenceID || ""

  const [hasPromoSelectionSaved, savePromoRemindMeSelection] = useLocalStorage(prefrenceID)

  const closeModal = () => {
    setModalOpen(false)
  }

  useEffect(() => {
    if (goToCloud({ userSavedPreference, ...GO_TO_CLOUD })) console.log("Lets go to cloud")
  }, [])
  useEffect(() => {
    if (goToAgentDashboard({ userSavedPreference })) console.log("Lets go to Agent")
  }, [])

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
