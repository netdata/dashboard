import React, { useState } from "react"
import { useLocalStorage } from "react-use"

import {
  MigrationModal,
  useMigrationModal,
  PromoProps,
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

const MigrationManager = () => {
  const [isModalOpen, setModalOpen] = useState(true)
  const { migrationModalPromoInfo, setUserPrefrence } = useMigrationModal({
    ...PROMO_SIGN_IN_CLOUD,
  })

  const prefrenceID = migrationModalPromoInfo?.tickBoxOption.prefrenceID || ""

  const [hasPromoSelectionSaved, savePromoRemindMeSelection] = useLocalStorage(prefrenceID)

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
