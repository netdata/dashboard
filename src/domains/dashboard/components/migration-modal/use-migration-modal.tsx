import React, { useMemo } from "react"
import Anchor from "@/src/components/anchor"
import { Text } from "@netdata/netdata-ui"
import { useLocalStorage } from "react-use"

type UserStatus = "LOGGED_IN" | "LOGGED_OUT" | "UNKNOWN"
type NodeClaimedStatus = "NOT_CLAIMED" | "UNKNOWN" | "CLAIMED" | "NO_ACCESS"
type UserNodeAccess = "NO_ACCESS" | "ACCESS_OK"
type UserPreference = "AGENT" | "CLOUD" | "UNDEFINED"
type NodeLiveness = "LIVE" | "NOT_LIVE"
type CTATYPE = "NAVIGATE" | "REFRESH"

export enum MigrationModalPromos {
  PROMO_SIGN_IN_CLOUD = "PROMO_SIGN_IN_CLOUD",
  PROMO_SIGN_UP_CLOUD = "PROMO_SIGN_UP_CLOUD",
  PROMO_IVNITED_TO_SPACE = "PROMO_IVNITED_TO_SPACE",
  PROMO_CLAIM_NODE = "PROMO_CLAIM_NODE",
  PROMO_TO_USE_NEW_DASHBAORD = "PROMO_TO_USE_NEW_DASHBAORD",
  FALLBACK_TO_AGENT = "FALLBACK_TO_AGENT",
  NO_INFO_FALLBACK_TO_AGENT = "NO_INFO_FALLBACK_TO_AGENT",
}

type MigrationModalActions = {
  text: string
  action: CTATYPE
  toPath?: string
  userPreference?: UserPreference | "DONT_SHOW"
}

type MigrationModalContent = {
  title: string
  text: {
    header: ((props: any) => React.ReactNode) | string
    bullets?: Array<string | ((props?: any) => React.ReactNode)>
    footer?: ((props: any) => React.ReactNode) | string
  }
  tickBoxOption: { text: string; prefrenceID: MigrationModalPromos }
  CTA1: MigrationModalActions
  CTA2?: MigrationModalActions
}

type MigrationModalInfo = {
  [key in MigrationModalPromos]: MigrationModalContent
}

export const migrationmodalInfo: MigrationModalInfo = {
  [MigrationModalPromos.PROMO_SIGN_UP_CLOUD]: {
    title: "Learn about Netdata Cloud!",
    text: {
      header: "Netdata Cloud is a FREE service that complements the Netdata agent, to provide:",
      bullets: [
        "Infrastructure level dashboards (each chart aggregates data from multiple nodes",
        "Central dispatch of alarm notifications",
        "Custom dashboards editor",
        "Intelligence assisted troubleshooting, to help surface the root cause of issues",
      ],
      footer: "Have a look, you will be surprised!",
    },
    tickBoxOption: {
      text: "Remember my choice",
      prefrenceID: MigrationModalPromos.PROMO_SIGN_UP_CLOUD,
    },
    CTA1: {
      text: "Wow! Let's go to Netdata Cloud",
      toPath: "path/signup/cloud",
      action: "NAVIGATE",
      userPreference: "CLOUD",
    },
    CTA2: {
      text: "Later, go to Agent",
      action: "NAVIGATE",
      toPath: "path/agent-dashboard",
      userPreference: "AGENT",
    },
  },
  [MigrationModalPromos.PROMO_SIGN_IN_CLOUD]: {
    title: "Sign-in to Netdata Cloud or get an invitation!",
    text: {
      header: "Netdata Cloud is a FREE service that complements the Netdata agent, to provide:",
      bullets: [
        "Infrastructure level dashboards (each chart aggregates data from multiple nodes",
        "Central dispatch of alarm notifications",
        "Custom dashboards editor",
        "Intelligence assisted troubleshooting, to help surface the root cause of issues",
      ],
      footer: "Have a look, you will be surprised!",
    },
    tickBoxOption: {
      text: "Remember my choice",
      prefrenceID: MigrationModalPromos.PROMO_SIGN_IN_CLOUD,
    },
    CTA1: {
      text: "Let me sign-in or get a Netdata Cloud account",
      action: "NAVIGATE",
      toPath: "path/signin/cloud",
      userPreference: "CLOUD",
    },
    CTA2: {
      text: "Later, go to Agent",
      toPath: "path/agent-dashboard",
      action: "NAVIGATE",
      userPreference: "AGENT",
    },
  },
  [MigrationModalPromos.PROMO_IVNITED_TO_SPACE]: {
    title: "Get an invitation to this Node’s Space!",
    text: {
      header: "Netdata Cloud is a FREE service that complements the Netdata agent, to provide:",
      bullets: [],
      footer: "Ask for an invitation to this Space!",
    },
    tickBoxOption: {
      text: "Don't remind me of this again",
      prefrenceID: MigrationModalPromos.PROMO_IVNITED_TO_SPACE,
    },
    CTA1: {
      text: "Thanks, take me to the Agent dashboard for now",
      toPath: "path/agent-dashboard",
      action: "NAVIGATE",
      userPreference: "AGENT",
    },
  },
  [MigrationModalPromos.PROMO_CLAIM_NODE]: {
    title: "This node isn’t connected to Netada Cloud",
    text: {
      header: "For you to be able to see this node on Netdata Cloud you will either need to:",
      footer: "Have a look, you will be surprised!",
      bullets: [
        () => {
          return (
            <Text>
              {" "}
              Connect this node directly ( documentation on{" "}
              <Anchor
                target="_blank"
                rel="noopener noreferrer"
                href="https://learn.netdata.cloud/docs/agent/claim#how-to-connect-a-node"
              >
                how to connect a node{" "}
              </Anchor>
              or activate streaming to a parent node that is already connected (documentation on
              <Anchor
                target="_blank"
                rel="noopener noreferrer"
                href="https://learn.netdata.cloud/docs/agent/claim#how-to-connect-a-node"
              >
                how to configure streaming)
              </Anchor>
            </Text>
          )
        },
      ],
    },
    tickBoxOption: {
      text: "Don't remind me of this again",
      prefrenceID: MigrationModalPromos.PROMO_CLAIM_NODE,
    },
    CTA1: {
      text: "Wow, Lets go to netdata",
      action: "NAVIGATE",
      toPath: "path/node/cloud",
      userPreference: "CLOUD",
    },
    CTA2: {
      text: "Later,show the Agent dasboard for now",
      action: "NAVIGATE",
      toPath: "path/agent-dashboard",
      userPreference: "AGENT",
    },
  },
  [MigrationModalPromos.PROMO_TO_USE_NEW_DASHBAORD]: {
    title: "Use the Old or the New dashboard?",
    text: {
      header:
        "This node is available in your Netdata Cloud account. So, you have full access to the NEW dashboards, charts, intelligence-assisted troubleshooting and many more!",
      bullets: [],
    },
    tickBoxOption: {
      text: "Remember my choice",
      prefrenceID: MigrationModalPromos.PROMO_TO_USE_NEW_DASHBAORD,
    },
    CTA1: {
      text: "Wow, Lets go to netdata",
      action: "NAVIGATE",
      toPath: "path/dashboard/cloud",
      userPreference: "CLOUD",
    },
    CTA2: {
      text: "Later, go to agent dashboard",
      action: "NAVIGATE",
      toPath: "path/agent-dashboard",
      userPreference: "AGENT",
    },
  },
  [MigrationModalPromos.FALLBACK_TO_AGENT]: {
    title: "Oops! This node has lost connection to Netdata Cloud!",
    text: {
      header: () => {
        return (
          <Text>
            This node is available in your Netdata Cloud account. So, you have full access to the
            NEW dashboards, charts, intelligence-assisted troubleshooting and many more!", The node
            lost its Netdata Cloud connection at DATE TIME. To troubleshoot Netdata Cloud connection
            issues, please follow{" "}
            <Anchor
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/netdata/product/issues/dummy-link"
            >
              this guide
            </Anchor>
          </Text>
        )
      },
      bullets: [],
    },
    tickBoxOption: {
      text: "Don't show this again",
      prefrenceID: MigrationModalPromos.FALLBACK_TO_AGENT,
    },
    CTA1: {
      text: "Check again",
      action: "REFRESH",
      userPreference: undefined,
    },
    CTA2: {
      text: "Thanks, take me to the Agent dashboard for now",
      toPath: "path/agent",
      action: "NAVIGATE",
      userPreference: "AGENT",
    },
  },
  [MigrationModalPromos.NO_INFO_FALLBACK_TO_AGENT]: {
    title: "Oops! We aren't able to get information of this node in regards to Netdata Cloud!",
    text: {
      header: () => {
        return (
          <Text>
            Unfortunately, it seems we aren't able to get information of this node in regards to
            Netdata Cloud. This could be from internet connectivity issues from your end or some
            temporary issue on our services. So, the old agent dashboard is the only option
            available.
          </Text>
        )
      },
      bullets: [],
    },
    tickBoxOption: {
      text: "Don't show this again",
      prefrenceID: MigrationModalPromos.NO_INFO_FALLBACK_TO_AGENT,
    },
    CTA1: {
      text: "Check again",
      action: "REFRESH",
      userPreference: undefined,
    },
    CTA2: {
      text: "Thanks, take me to the Agent dashboard for now",
      toPath: "path/agent-dashboard",
      action: "NAVIGATE",
      userPreference: "AGENT",
    },
  },
}

export type PromoProps = {
  userSavedPreference?: UserPreference
  userStatus?: UserStatus
  nodeClaimedStatus?: NodeClaimedStatus
  userNodeAccess?: UserNodeAccess
  nodeLiveness?: NodeLiveness
}

const isPromoSignUp = ({
  userSavedPreference,
  userStatus,
  nodeClaimedStatus,
}: PromoProps): boolean =>
  userSavedPreference &&
  userSavedPreference !== "AGENT" &&
  userStatus === "UNKNOWN" &&
  nodeClaimedStatus === "NOT_CLAIMED"

const isPromoSignIn = ({
  userSavedPreference,
  userStatus,
  nodeClaimedStatus,
}: PromoProps): boolean =>
  userSavedPreference &&
  userSavedPreference !== "AGENT" &&
  userStatus === "UNKNOWN" &&
  nodeClaimedStatus === "CLAIMED"

const isPromoInvitedToSpace = ({
  userSavedPreference,
  userStatus,
  nodeClaimedStatus,
  userNodeAccess,
}: PromoProps): boolean =>
  userSavedPreference &&
  userSavedPreference !== "AGENT" &&
  (userStatus === "LOGGED_IN" || userStatus === "LOGGED_OUT") &&
  nodeClaimedStatus === "CLAIMED" &&
  userNodeAccess === "NO_ACCESS"

const isPromoToClaimThisNode = ({
  userSavedPreference,
  userStatus,
  nodeClaimedStatus,
}: PromoProps): boolean =>
  userSavedPreference &&
  userSavedPreference !== "AGENT" &&
  (userStatus === "LOGGED_IN" || userStatus === "LOGGED_OUT") &&
  nodeClaimedStatus === "NOT_CLAIMED"

const isPromoToNewDasboardOnCloud = ({
  userSavedPreference,
  userStatus,
  nodeLiveness,
  userNodeAccess,
}: PromoProps): boolean =>
  !userSavedPreference &&
  (userStatus === "LOGGED_IN" || userStatus === "LOGGED_OUT") &&
  nodeLiveness === "LIVE" &&
  userNodeAccess === "ACCESS_OK"

const isNoInfoFallbackToAgent = ({
  userSavedPreference,
  userStatus,
  nodeClaimedStatus,
  nodeLiveness,
  userNodeAccess,
}: PromoProps): boolean =>
  userSavedPreference === "CLOUD" &&
  !userStatus &&
  !nodeClaimedStatus &&
  !nodeLiveness &&
  !userNodeAccess

const isFallbackToAgent = ({
  userSavedPreference,
  userStatus,
  nodeClaimedStatus,
  nodeLiveness,
  userNodeAccess,
}: PromoProps): boolean =>
  userSavedPreference === "CLOUD" &&
  (userStatus === "LOGGED_IN" || userStatus === "LOGGED_OUT") &&
  nodeClaimedStatus === "CLAIMED" &&
  nodeLiveness === "NOT_LIVE" &&
  userNodeAccess === "ACCESS_OK"

const modalStatusWithPromoFunctions: Record<MigrationModalPromos, (props: PromoProps) => boolean> =
  {
    [MigrationModalPromos.FALLBACK_TO_AGENT]: isFallbackToAgent,
    [MigrationModalPromos.NO_INFO_FALLBACK_TO_AGENT]: isNoInfoFallbackToAgent,
    [MigrationModalPromos.PROMO_TO_USE_NEW_DASHBAORD]: isPromoToNewDasboardOnCloud,
    [MigrationModalPromos.PROMO_CLAIM_NODE]: isPromoToClaimThisNode,
    [MigrationModalPromos.PROMO_IVNITED_TO_SPACE]: isPromoInvitedToSpace,
    [MigrationModalPromos.PROMO_SIGN_IN_CLOUD]: isPromoSignIn,
    [MigrationModalPromos.PROMO_SIGN_UP_CLOUD]: isPromoSignUp,
  }

const useMigrationModal = ({
  userStatus,
  nodeClaimedStatus,
  userNodeAccess,
  nodeLiveness,
}: PromoProps) => {
  const [userSavedPreference, setUserPrefrence] =
    useLocalStorage<UserPreference>("USER_SAVED_PREFERENCE")

  const migrationModalPromo = useMemo<MigrationModalPromos>(() => {
    return Object.keys(modalStatusWithPromoFunctions).find(modalStatus => {
      return modalStatusWithPromoFunctions[modalStatus]({
        userStatus,
        nodeClaimedStatus,
        userNodeAccess,
        userSavedPreference,
        nodeLiveness,
      })
    }) as MigrationModalPromos
  }, [userStatus])

  return {
    migrationModalPromoInfo: migrationmodalInfo[migrationModalPromo],
    migrationModalPromo,
    setUserPrefrence,
  }
}

export default useMigrationModal
