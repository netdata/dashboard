export const agentsMock = [
  {
    name: "Secret Agent Legakis",
    validURLs: {
      "www.google.ru": null,
      "www.google.com": null,
    },
  },
  {
    name: "企鹅",
    validURLs: {
      "www.企鹅.com": null,
    },
  },
  { name: "Birb" },
  { name: "Quality Node" },
  { name: "Clarity Wave" },
]

export const masterNodeMock = {
  name: "Master Node",
  nodes: [
    { name: "Abstract name" },
    { name: "Even more abstract name, but very-very long, like really" },
    { name: "企业猫" },
  ],
}

export const roomsMock = [
  { name: "Insanity Room", alarmCounter: { critical: 3, warning: 2, unreachable: 2 }, id: "x" },
  { name: "Unreachable Room", alarmCounter: { critical: 0, warning: 0, unreachable: 1 }, id: "d" },
  {
    name: "Extremely long name room where a lot of concerning things happen",
    alarmCounter: { critical: 1000, warning: 9999, unreachable: 101 },
    id: "dd",
  },
  {
    name: "Just a normal room",
    alarmCounter: { critical: 0, warning: 0, unreachable: 0 },
    id: "xdd",
  },
  { name: "Warnings Room", alarmCounter: { critical: 0, warning: 1, unreachable: 0 }, id: "dx" },
  {
    name: "Critical Room, don't delete",
    alarmCounter: { critical: 1, warning: 0, unreachable: 0 },
    id: "dxd",
  },
]

/*
Cloud types for reference

export interface Agent {
  id: string
  urls?: string[]
  name?: string
  lastAccessTime?: string
  accountID?: string | null
  validURLs?: { [url: string]: null }
  invalidURLs?: { [url: string]: InvalidAgentUrlReason }
  services?: Service[]
  os?: string
  warningAlarmsCount?: number
  criticalAlarmsCount?: number
  accessCount?: number
  isOutdated?: boolean // has old, deprecated agent software version.
  wasUnreachable?: boolean
  permissions?: string
  properties?: string
  claimedAt?: string | null

  version?: string
  uid?: string
  mirrored_hosts?: string[]
  alarms?: {
    normal?: number
    warning?: number
    critical?: number
  }
  os_name?: string
  os_id?: string
  os_id_like?: string
  os_version?: string
  os_version_id?: string
  os_detection?: string
  kernel_name?: string
  kernel_version?: string
  architecture?: string
  virtualization?: string
  virt_detection?: string
  container?: string
  container_detection?: string
  collectors?: CollectorStruct[]
}

export type Workspace = {
  id: string
  name: string
  description?: string | undefined
  slug: string
  iconURL?: string | null
  createdAt?: string
  state: string
  defaultRooms?: string[]
  emailDomains?: string[]
  inviteAdminsOnly?: boolean
  createRoomAdminsOnly?: boolean
  members?: WorkspaceUser[]
  apps?: WorkspaceApp[]
  invitations?: WorkspaceInvitation[]
  claimingTokens?: ClaimingToken[]
}

export interface Room {
  id: string
  name: string
  description?: string
  isPrivate: boolean
  nodeIDs: string[]
  workspaceId: string
  createdAt: string
  members: string[]
  isUntouchable: boolean
  alarmCounter?: {
    warning: number
    critical: number
  }
}
*/
