import { useMemo } from "react"
import { options } from "domains/dashboard/utils/netdata-dashboard"
import { useContainer } from "domains/charts/charts"

const chartsPerRow = () => (options.chartsPerRow === 0 ? 1 : options.chartsPerRow)

export default updateEvery => {
  const container = useContainer()

  const { width } = container.getBoundingClientRect()

  useMemo(() => {
    const pcentWidth = Math.floor(100 / chartsPerRow())
    return Math.round((((width * pcentWidth) / 100) * (updateEvery || 1)) / 3 / 60) * 60
  }, [width])
}
