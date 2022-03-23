import React, { useMemo } from "react"
import Anchor from "@/src/components/anchor"
import { Text } from "@netdata/netdata-ui"
import { useLocalStorage } from "react-use"
import { utmUrlSuffix } from "utils/utils"
import { utmParametersToString } from "domains/global/selectors"

export type UserStatus = "LOGGED_IN" | "EXPIRED_LOGIN" | "UNKNOWN"
export type NodeClaimedStatus = "NOT_CLAIMED" | "CLAIMED"
export type UserNodeAccess = "NO_ACCESS" | "ACCESS_OK"
type UserPreference = "AGENT" | "CLOUD" | "UNDEFINED"
export type NodeLiveness = "LIVE" | "NOT_LIVE"
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

const campaign = "agent_nudge_to_cloud"

const makeUTMParameters = (modalPromo: MigrationModalPromos) =>
  `${utmUrlSuffix}${utmParametersToString({
    content: modalPromo,
    campaign,
  })}`

export const migrationmodalInfo: MigrationModalInfo = {
  [MigrationModalPromos.PROMO_SIGN_UP_CLOUD]: {
    title: "Learn about Netdata Cloud!",
    text: {
      header: () => (
        <Text strong>
          Netdata Cloud is a FREE service that complements the Netdata Agent, to provide:
        </Text>
      ),
      bullets: [
        "Infrastructure level dashboards (each chart aggregates data from multiple nodes)",
        "Central dispatch of alert notifications",
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
      text: "Wow! Let’s go to Netdata Cloud",
      toPath: "path/signup/cloud",
      action: "NAVIGATE",
      userPreference: "CLOUD",
    },
    CTA2: {
      text: "Later, stay at the agent dashboard",
      action: "NAVIGATE",
      toPath: "path/agent-dashboard",
      userPreference: "AGENT",
    },
  },
  [MigrationModalPromos.PROMO_SIGN_IN_CLOUD]: {
    title: "Sign-in to Netdata Cloud or get an invitation!",
    text: {
      header: () => (
        <>
          <Text strong>
            This node is connected to Netdata Cloud but you are not. If you have a Netdata Cloud
            account sign-in, if not ask for an invitation to it.
          </Text>

          <Text>
            Netdata Cloud is a FREE service that complements the Netdata Agent, to provide:
          </Text>
        </>
      ),
      bullets: [
        "Infrastructure level dashboards (each chart aggregates data from multiple nodes)",
        "Central dispatch of alert notifications",
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
      text: "Sign-in or get a Netdata Cloud account",
      action: "NAVIGATE",
      toPath: "path/signin/cloud",
      userPreference: "CLOUD",
    },
    CTA2: {
      text: "Later, stay at the Agent dashboard",
      toPath: "path/agent-dashboard",
      action: "NAVIGATE",
      userPreference: "AGENT",
    },
  },
  [MigrationModalPromos.PROMO_IVNITED_TO_SPACE]: {
    title: "Get an invitation to this Node’s Space!",
    text: {
      header: () => (
        <Text strong>
          This node is connected to Netdata Cloud but it isnt available on one of your Spaces.
        </Text>
      ),
      bullets: [],
      footer: "Ask for an invitation to this Space!",
    },
    tickBoxOption: {
      text: "Don't remind me of this again",
      prefrenceID: MigrationModalPromos.PROMO_IVNITED_TO_SPACE,
    },
    CTA1: {
      text: "Thanks, stay at Agent dashboard for now",
      toPath: "agent",
      action: "NAVIGATE",
      userPreference: "AGENT",
    },
  },
  [MigrationModalPromos.PROMO_CLAIM_NODE]: {
    title: "This node isn’t connected to Netdata Cloud",
    text: {
      header: () => (
        <Text strong>
          For you to be able to see this node on Netdata Cloud you will either need to:
        </Text>
      ),
      footer: "Have a look, you will be surprised!",
      bullets: [
        () => {
          return (
            <Text>
              {" "}
              Connect this node directly (documentation on{" "}
              <Anchor
                target="_blank"
                rel="noopener noreferrer"
                href={`https://learn.netdata.cloud/docs/agent/claim?${makeUTMParameters(
                  MigrationModalPromos.PROMO_CLAIM_NODE
                ).substring(1)}#how-to-connect-a-node`}
              >
                how to connect a node
              </Anchor>
              ) , or
            </Text>
          )
        },
        () => {
          return (
            <Text>
              Αctivate streaming to a parent node that is already connected (documentation on{" "}
              <Anchor
                target="_blank"
                rel="noopener noreferrer"
                href={`https://learn.netdata.cloud/docs/metrics-storage-management/enable-streaming?${makeUTMParameters(
                  MigrationModalPromos.PROMO_CLAIM_NODE
                ).substring(1)}`}
              >
                how to configure streaming
              </Anchor>
              )
            </Text>
          )
        },
      ],
    },
    tickBoxOption: {
      text: "Remember my choice.",
      prefrenceID: MigrationModalPromos.PROMO_CLAIM_NODE,
    },
    CTA1: {
      text: "Wow! Let’s go to Netdata Cloud",
      action: "NAVIGATE",
      toPath: "path/node/cloud",
      userPreference: "CLOUD",
    },
    CTA2: {
      text: "Later, stay at the Agent dashboard",
      action: "NAVIGATE",
      toPath: "path/agent-dashboard",
      userPreference: "AGENT",
    },
  },
  [MigrationModalPromos.PROMO_TO_USE_NEW_DASHBAORD]: {
    title: "Use the Old or the New dashboard?",
    text: {
      header: () => (
        <Text strong>
          This node is available in your Netdata Cloud account. So, you have full access to the NEW
          dashboards, charts, intelligence-assisted troubleshooting and many more!
        </Text>
      ),
      bullets: [],
    },
    tickBoxOption: {
      text: "Remember my choice",
      prefrenceID: MigrationModalPromos.PROMO_TO_USE_NEW_DASHBAORD,
    },
    CTA1: {
      text: "Wow! Let’s go to Netdata Cloud ",
      action: "NAVIGATE",
      toPath: "path/dashboard/cloud",
      userPreference: "CLOUD",
    },
    CTA2: {
      text: "Later, stay at the Agent dashboard",
      action: "NAVIGATE",
      toPath: "path/agent-dashboard",
      userPreference: "AGENT",
    },
  },
  [MigrationModalPromos.FALLBACK_TO_AGENT]: {
    title: "Oops! This node has lost connection to Netdata Cloud!",
    text: {
      header: ({ date = "" }) => {
        return (
          <>
            <Text strong>
              Unfortunately, it seems that this node is not currently connected to Netdata Cloud.
              So, the old agent dashboard is the only option available.
            </Text>
            {/* <Text>
              The node lost its Netdata Cloud connection at <Text strong>{date}</Text>.
            </Text> */}
            <Text>
              To troubleshoot Netdata Cloud connection issues, please follow this{" "}
              <Anchor
                target="_blank"
                rel="noopener noreferrer"
                href={`https://learn.netdata.cloud/docs/agent/claim?${makeUTMParameters(
                  MigrationModalPromos.FALLBACK_TO_AGENT
                ).substring(1)}#troubleshooting`}
              >
                this guide.
              </Anchor>
            </Text>
          </>
        )
      },
      bullets: [],
    },
    tickBoxOption: {
      text: "Don't show this again",
      prefrenceID: MigrationModalPromos.FALLBACK_TO_AGENT,
    },
    CTA1: {
      text: "Check again please",
      action: "REFRESH",
      userPreference: undefined,
    },
    CTA2: {
      text: "Thanks, stay at Agent dashboard",
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
          <>
            <Text strong>
              Unfortunately, it seems we aren't able to get information on this node in regards to
              Netdata Cloud.
            </Text>
            <Text>
              This could be from internet connectivity issues from your end or some temporary issue
              with our services. So, the old agent dashboard is the only option available.
            </Text>
          </>
        )
      },
      bullets: [],
    },
    tickBoxOption: {
      text: "Don't show this again",
      prefrenceID: MigrationModalPromos.NO_INFO_FALLBACK_TO_AGENT,
    },
    CTA1: {
      text: "Check again please",
      action: "REFRESH",
      userPreference: undefined,
    },
    CTA2: {
      text: "Thanks, stay at Agent dashboard",
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
  userSavedPreference !== "AGENT" && userStatus === "UNKNOWN" && nodeClaimedStatus === "NOT_CLAIMED"

const isPromoSignIn = ({
  userSavedPreference,
  userStatus,
  nodeClaimedStatus,
}: PromoProps): boolean =>
  userSavedPreference !== "AGENT" && userStatus === "UNKNOWN" && nodeClaimedStatus === "CLAIMED"

const isPromoInvitedToSpace = ({
  userSavedPreference,
  userStatus,
  nodeClaimedStatus,
  userNodeAccess,
}: PromoProps): boolean =>
  userSavedPreference !== "AGENT" &&
  (userStatus === "LOGGED_IN" || userStatus === "EXPIRED_LOGIN") &&
  nodeClaimedStatus === "CLAIMED" &&
  userNodeAccess === "NO_ACCESS"

const isPromoToClaimThisNode = ({
  userSavedPreference,
  userStatus,
  nodeClaimedStatus,
}: PromoProps): boolean =>
  userSavedPreference !== "AGENT" &&
  (userStatus === "LOGGED_IN" || userStatus === "EXPIRED_LOGIN") &&
  nodeClaimedStatus === "NOT_CLAIMED"

const isPromoToNewDasboardOnCloud = ({
  userSavedPreference,
  userStatus,
  nodeLiveness,
  userNodeAccess,
}: PromoProps): boolean =>
  !userSavedPreference &&
  (userStatus === "LOGGED_IN" || userStatus === "EXPIRED_LOGIN") &&
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
  userSavedPreference !== "AGENT" &&
  (userStatus === "LOGGED_IN" || userStatus === "EXPIRED_LOGIN") &&
  nodeClaimedStatus === "CLAIMED" &&
  nodeLiveness === "NOT_LIVE" &&
  userNodeAccess === "ACCESS_OK"

export const goToAgentDashboard = ({ userSavedPreference }: PromoProps) =>
  userSavedPreference === "AGENT"

export const goToCloud = ({
  userSavedPreference,
  userStatus,
  nodeLiveness,
  userNodeAccess,
}: PromoProps) =>
  userSavedPreference === "CLOUD" &&
  (userStatus === "LOGGED_IN" || userStatus === "EXPIRED_LOGIN") &&
  nodeLiveness === "LIVE" &&
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
  }, [userStatus, nodeClaimedStatus, userNodeAccess, nodeLiveness, userSavedPreference])

  return {
    migrationModalPromoInfo: migrationmodalInfo[migrationModalPromo],
    migrationModalPromo,
    setUserPrefrence,
    userSavedPreference,
  }
}

export default useMigrationModal
