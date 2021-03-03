import { useMemo } from "react"
import { options } from "domains/dashboard/utils/netdata-dashboard"

const chartsPerRow = () => (options.chartsPerRow === 0 ? 1 : options.chartsPerRow)

export default (width, updateEvery) =>
  useMemo(() => {
    const pcentWidth = Math.floor(100 / chartsPerRow())
    return Math.round((((width * pcentWidth) / 100) * (updateEvery || 1)) / 3 / 60) * 60
  }, [width])
