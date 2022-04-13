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
import { useRequestRefreshOfAccessMessage } from "hooks/use-user-node-access"
import { selectIsCloudEnabled } from "domains/global/selectors"
import { selectRegistry } from "domains/global/selectors"

// const PROMO_SIGN_UP_CLOUD: PromoProps = { userStatus: "UNKNOWN", nodeClaimedStatus: "NOT_CLAIMED" } //CLOUD
// const PROMO_SIGN_IN_CLOUD: PromoProps = {
//   userStatus: "UNKNOWN",
//   nodeClaimedStatus: "CLAIMED",
// } //CLOUD
// const PROMO_IVNITED_TO_SPACE: PromoProps = {
//   userStatus: "LOGGED_IN",
//   nodeClaimedStatus: "CLAIMED",
//   userNodeAccess: "NO_ACCESS",
// } //CLOUD

// const PROMO_CLAIM_NODE: PromoProps = { userStatus: "LOGGED_IN", nodeClaimedStatus: "NOT_CLAIMED" } //CLOUD
// const PROMO_TO_USE_NEW_DASHBAORD: PromoProps = {
//   userStatus: "LOGGED_IN",
//   nodeLiveness: "LIVE",
//   userNodeAccess: "ACCESS_OK",
// } //UNDEFIND

// const FALLBACK_TO_AGENT: PromoProps = {
//   userStatus: "LOGGED_IN",
//   nodeLiveness: "NOT_LIVE",
//   userNodeAccess: "ACCESS_OK",
//   nodeClaimedStatus: "CLAIMED",
// } //CLOUD

// const NO_INFO_FALLBACK_TO_AGENT: PromoProps = {
//   userStatus: undefined,
//   nodeLiveness: undefined,
//   userNodeAccess: undefined,
//   nodeClaimedStatus: undefined,
// } //CLOUD

// const GO_TO_CLOUD: PromoProps = {
//   userStatus: "LOGGED_IN",
//   nodeLiveness: "LIVE",
//   userNodeAccess: "ACCESS_OK",
//   nodeClaimedStatus: "CLAIMED",
// } //CLOUD

const MigrationManager = () => {
  const cloudEnabled = useSelector(selectIsCloudEnabled)
  const registry = useSelector(selectRegistry)

  const cloudUrl = useSelector(state =>
    selectSignInUrl({ content: "agent-auto-redirect", term: registry.machineGuid })(state as any)
  )

  const linkToCoud = useMemo(() => {
    const { href } = window.location
    const redirectURI = encodeURIComponent(href)
    return `${cloudUrl}&redirect_uri=${redirectURI}`
  }, [cloudUrl])

  const userNodeAccess = useSelector(selectUserNodeAccess) as PromoProps
  const [isModalOpen, setModalOpen] = useState(false)
  const { migrationModalPromoInfo, setUserPrefrence, userSavedPreference, migrationModalPromo } =
    useMigrationModal({
      ...userNodeAccess,
    })

  const prefrenceID = migrationModalPromoInfo?.tickBoxOption.prefrenceID || ""

  /**
   * There is seem to be a bug when we are using the useLocalStorage,
   * the value to be returned does not change when prefrenceID is changing.
   * For that reason we acces the localStorage directly
   */
  const [, savePromoRemindMeSelection] = useLocalStorage(prefrenceID)
  const hasPromoSelectionSaved = localStorage.getItem(prefrenceID)

  const closeModal = () => {
    setModalOpen(false)
  }

  const isPromoEligibleForShow =
    cloudEnabled &&
    migrationModalPromoInfo &&
    isModalOpen &&
    (!hasPromoSelectionSaved || hasPromoSelectionSaved === "undefined")

  const requestRefreshOfAccess = useRequestRefreshOfAccessMessage()

  /** We are delaying the show of modal because some time the userNodeAccess is equal to null
   *  and only for a few seconds we are showing the NO_INFO modal an the the userNodeAccess
   *  has a new value and we show a second modal on top of the other. We dont want this
   *  behaviour
   */
  useEffect(() => {
    let showModalTimer = setTimeout(() => setModalOpen(true), 4000)
    return () => {
      clearTimeout(showModalTimer)
    }
  }, [])

  useEffect(() => {
    if (goToCloud({ userSavedPreference, ...userNodeAccess })) {
      window.location.href = linkToCoud
    }
  }, [linkToCoud, userNodeAccess, userSavedPreference])

  useEffect(() => {
    if (goToAgentDashboard({ userSavedPreference })) console.log("Lets go to Agent")
  }, [userSavedPreference])

  useEffect(() => {
    if (isPromoEligibleForShow) {
      document.documentElement.style.overflow = "hidden"
    } else {
      document.documentElement.style.overflow = "auto"
    }
  }, [isModalOpen, isPromoEligibleForShow])

  if (isPromoEligibleForShow)
    return (
      <MigrationModal
        savePromoRemindMeSelection={savePromoRemindMeSelection}
        migrationModalPromoInfo={migrationModalPromoInfo}
        setUserPrefrence={setUserPrefrence}
        closeModal={closeModal}
        migrationModalPromo={migrationModalPromo}
        requestRefreshOfAccess={requestRefreshOfAccess}
      />
    )

  return null
}

export default MigrationManager
