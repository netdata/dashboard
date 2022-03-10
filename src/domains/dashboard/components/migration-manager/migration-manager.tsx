import React, { useState, useEffect, useMemo } from "react"
import { useLocalStorage } from "react-use"
import { useSelector } from "react-redux"

import { selectUserNodeAccess } from "domains/global/selectors"
import {
  MigrationModal,
  useMigrationModal,
  PromoProps,
  goToCloud,
  goToAgentDashboard,
} from "@/src/domains/dashboard/components/migration-modal"
import { selectSignInUrl } from "domains/global/selectors"

const PROMO_SIGN_UP_CLOUD: PromoProps = { userStatus: "UNKNOWN", nodeClaimedStatus: "NOT_CLAIMED" } //CLOUD
const PROMO_SIGN_IN_CLOUD: PromoProps = {
  userStatus: "EXPIRED_LOGIN",
  nodeClaimedStatus: "CLAIMED",
} //CLOUD
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
  const cloudUrl = useSelector(state => selectSignInUrl("go-to-cloud-migration")(state as any))

  const linkToCoud = useMemo(() => {
    const { href } = window.location
    const redirectURI = encodeURIComponent(href)
    return `${cloudUrl}&redirect_uri=${redirectURI}`
  }, [cloudUrl])

  const userNodeAccess = useSelector(selectUserNodeAccess) as PromoProps
  const [isModalOpen, setModalOpen] = useState(true)
  const { migrationModalPromoInfo, setUserPrefrence, userSavedPreference, migrationModalPromo } =
    useMigrationModal({
      ...userNodeAccess,
    })

  console.log({ userNodeAccess })

  const prefrenceID = migrationModalPromoInfo?.tickBoxOption.prefrenceID || ""

  const [hasPromoSelectionSaved, savePromoRemindMeSelection] = useLocalStorage(prefrenceID)

  const closeModal = () => {
    setModalOpen(false)
  }

  useEffect(() => {
    if (goToCloud({ userSavedPreference, ...userNodeAccess })) window.location.href = linkToCoud
  }, [linkToCoud])

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
        migrationModalPromo={migrationModalPromo}
      />
    )

  return null
}

export default MigrationManager
