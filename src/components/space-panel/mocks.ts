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
  nodes: [{ name: "Abstract name" }, { name: "Even more abstract" }, { name: "企业猫" }],
}

/*
Cloud agent type for reference

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
*/
