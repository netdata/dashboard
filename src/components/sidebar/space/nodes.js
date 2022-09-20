import { naturalSortCompare } from "domains/dashboard/utils/sorting"

const getBaseUrl = hostname => {
  let base = document.location.origin.toString() + decodeURI(document.location.pathname.toString())
  if (base.endsWith(`/host/${hostname}/`)) {
    base = base.substring(0, base.length - `/host/${hostname}/`.toString().length)
  }

  if (base.endsWith("/")) {
    base = base.substring(0, base.length - 1)
  }

  return base
}

const getNodeUrl = (baseUrl, hostname) => `${baseUrl}/host/${hostname}/`

const getNodes = (hosts, hostname, hostsStatus) => {
  if (!hosts || !hostname) return {}

  // decodeURI, because pathname (which is hostname) can contain white-spaces
  // or other characters which are URIencoded when user clicks the link
  // and we need to match it with `chartsMetadata.hostname`
  const baseUrl = getBaseUrl(hostname)

  const [{ hostname: parentNodeHostname }] = hosts

  const parentNode = {
    hostname: parentNodeHostname,
    url: `${baseUrl}/`,
  }

  const replicatedNodes = hosts
    .slice(1)
    .map(({ hostname }, index) => ({
      hostname,
      url: getNodeUrl(baseUrl, hostname),
      status: hostsStatus.find(host => host.hostname === hostname)?.reachable || false,
    }))
    .sort((a, b) => naturalSortCompare(a.hostname, b.hostname))

  return {
    parentNode,
    replicatedNodes,
  }
}

export default getNodes
