import React, { useMemo } from "react"
import Anchor from "@/src/components/anchor"
import { Text } from "@netdata/netdata-ui"
import { useLocalStorage } from "react-use"

enum MigrationModalStatus {
  PROMO_SIGN_IN_CLOUD = "PROMO_SIGN_IN_CLOUD",
  PROMO_SIGN_UP_CLOUD = "PROMO_SIGN_UP_CLOUD",
  PROMO_IVNITED_TO_SPACE = "PROMO_IVNITED_TO_SPACE",
  PROMO_CLAIM_NODE = "PROMO_CLAIM_NODE",
  PROMO_TO_USE_NEW_DASHBAORD = "PROMO_TO_USE_NEW_DASHBAORD",
  FALLBACK_TO_AGENT = "FALLBACK_TO_AGENT",
  NO_INFO_FALLBACK_TO_AGENT = "NO_INFO_FALLBACK_TO_AGENT",
  ACLK = "ACLK",
}

type MigrationModalActions = {
  text: string
  onClick: () => void
}

type MigrationModalContent = {
  title: string
  text: {
    header: ((props: any) => React.ReactNode) | string
    bullets?: Array<string | ((props: any) => React.ReactNode)>
    footer?: ((props: any) => React.ReactNode) | string
  }
  tickBoxOption: { text: string; onClick: () => void }
  CTA1: MigrationModalActions
  CTA2?: MigrationModalActions
}

type MigrationModalState = {
  [key in MigrationModalStatus]: MigrationModalContent
}

const modalStatuses: MigrationModalState = {
  [MigrationModalStatus.PROMO_SIGN_UP_CLOUD]: {
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
    tickBoxOption: { text: "Remember my choice", onClick: () => "saved" },
    CTA1: { text: "Wow! Let's go to Netdata Cloud", onClick: () => "Go to Netdata cloud" },
    CTA2: { text: "Later, show the Agent dashboard for now", onClick: () => "Dashboard agent" },
  },
  [MigrationModalStatus.PROMO_SIGN_IN_CLOUD]: {
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
    tickBoxOption: { text: "Remember my choice", onClick: () => "saved" },
    CTA1: {
      text: "Let me sign-in or get a Netdata Cloud account",
      onClick: () => "Sign in",
    },
    CTA2: { text: "Later, show the Agent dashboard for now", onClick: () => "Dashboard agent" },
  },
  [MigrationModalStatus.PROMO_IVNITED_TO_SPACE]: {
    title: "Get an invitation to this Node’s Space!",
    text: {
      header: "Netdata Cloud is a FREE service that complements the Netdata agent, to provide:",
      footer: "Ask for an invitation to this Space!",
    },
    tickBoxOption: { text: "Don't remind me of this again", onClick: () => "Do not remind" },
    CTA1: {
      text: "Thanks, take me to the Agent dashboard for now",
      onClick: () => "Take me to agent dashboard",
    },
  },
  [MigrationModalStatus.PROMO_CLAIM_NODE]: {
    title: "This node isn’t connected to Netada Cloud",
    text: {
      header: "For you to be able to see this node on Netdata Cloud you will either need to:",
      footer: "Have a look, you will be surprised!",
      bullets: [
        () => {
          return (
            <Text>
              {" "}
              connect this node directly ( documentation on{" "}
              <Anchor
                target="_blank"
                rel="noopener noreferrer"
                href="https://learn.netdata.cloud/docs/agent/claim#how-to-connect-a-node"
              >
                how to connect a node
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
    tickBoxOption: { text: "Don't remind me of this again", onClick: () => "Do not remind" },
    CTA1: {
      text: "Wow, Lets go to netdata",
      onClick: () => "Take me to agent dashboard",
    },
    CTA2: {
      text: "Later,show the Agent dasboard for now",
      onClick: () => "Take me to agent dashboard",
    },
  },
  [MigrationModalStatus.PROMO_TO_USE_NEW_DASHBAORD]: {
    title: "Use the Old or the New dashboard?",
    text: {
      header:
        "This node is available in your Netdata Cloud account. So, you have full access to the NEW dashboards, charts, intelligence-assisted troubleshooting and many more!",
    },
    tickBoxOption: { text: "Remember my choise", onClick: () => "Remember" },
    CTA1: {
      text: "Wow, Lets go to netdata",
      onClick: () => "Take me to agent New dashboard",
    },
    CTA2: {
      text: "Later,show the Agent dasboard for now",
      onClick: () => "show me agent for now",
    },
  },
  [MigrationModalStatus.FALLBACK_TO_AGENT]: {
    title: "Oops! This node has lost connection to Netdata Cloud!",
    text: {
      header: () => {
        return (
          <Text>
            "This node is available in your Netdata Cloud account. So, you have full access to the
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
    },
    tickBoxOption: { text: "Don't show this again", onClick: () => "dont show" },
    CTA1: {
      text: "Check again",
      onClick: () => "check again",
    },
    CTA2: {
      text: "Thanks, take me to the Agent dashboard for now",
      onClick: () => "show me agent for now",
    },
  },
  [MigrationModalStatus.NO_INFO_FALLBACK_TO_AGENT]: {
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
    },
    tickBoxOption: { text: "Don't show this again", onClick: () => "dont show" },
    CTA1: {
      text: "Check again",
      onClick: () => "check again",
    },
    CTA2: {
      text: "Thanks, take me to the Agent dashboard for now",
      onClick: () => "show me agent for now",
    },
  },
  [MigrationModalStatus.ACLK]: {
    title: "Oops! We aren't able to get information of this node in regards to Netdata Cloud!",
    text: {
      header: "This node is currently Connected/Not Connected to Netdata Cloud",
      bullets: [
        "The node lost its Netdata Cloud connection at DATE TIME.",
        "To troubleshoot Netdata Cloud connection issues, please follow this guide. (only shows on Not Connected)",
      ],
      footer: "You are Logged in/Logged out/Not signed-up to Netdata Cloud",
    },
    tickBoxOption: { text: "Don't show this again", onClick: () => "dont show" },
    CTA1: {
      text: "Take me to Netdata Cloud",
      onClick: () => "Take me to",
    },
  },
}

type UserStatus = "LOGGED_IN" | "LOGGED_OUT" | "UNKNOWN"
type NodeClaimedStatus = "NOT_CLAIMED" | "UNKNOWN" | "CLAIMED" | "NO_ACCESS"

const useMigrationModal = ({
  userStatus,
  nodeClaimedStatus,
}: {
  userStatus: UserStatus
  nodeClaimedStatus: NodeClaimedStatus
}) => {
  const [value, setValue] = useLocalStorage("USER_SAVED_PREFERENCE")
  const modalStatus = useMemo(() => {}, [userStatus])

  const modalContent = useMemo(() => {}, [modalStatus])
}

export default useMigrationModal
