const isPrintMode = window.location.hash.split(";").includes("help=true")

const getIsDemo = () => {
  if (isPrintMode) {
    return false
  }
  const { hostname } = document.location
  return (
    hostname.endsWith(".my-netdata.io")
    || hostname.endsWith(".mynetdata.io")
    || hostname.endsWith(".netdata.rocks")
    || hostname.endsWith(".netdata.ai")
    || hostname.endsWith(".netdata.live")
    || hostname.endsWith(".firehol.org")
    || hostname.endsWith(".netdata.online")
    || hostname.endsWith(".netdata.cloud")
  )
}

export const isDemo = getIsDemo()
