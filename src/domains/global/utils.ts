const allowedReferrerDomains = [
  "",
  "https://www.google.com/",
  "https://duckduckgo.com/",
  "https://www.reddit.com/",
]

export const isAllowedReferrer = (referrer: string) => allowedReferrerDomains.includes(referrer)
  || referrer.endsWith(".my-netdata.io/")
  || referrer.startsWith("https://github.com/")
  || referrer.endsWith("netdata.cloud/")
