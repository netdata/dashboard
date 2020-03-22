// we use numbers to specify time. it can be either a timestamp (ms), or a relative value in seconds
// which is always 0 or less (0 is now, -300 is -5 minutes)

export const isTimestamp = (x: number) => x > 0

export const NETDATA_REGISTRY_SERVER = "https://registry.my-netdata.io"

export const MS_IN_SECOND = 1000
