import { useMemo } from "react"
import { renderChartsAndMenu } from "../../utils/render-charts-and-menu"
import { sortObjectByPriority } from "../../utils/sorting"

export default ({ metricsCorrelationMetadata, chartsMetadata, hasKubernetes }) => {
  const menuPartialMetadata = metricsCorrelationMetadata || chartsMetadata
  // This is used to generate and show some statistics VS the full dataset
  const fullMetadata = metricsCorrelationMetadata && chartsMetadata
  const menus = useMemo(
    () => renderChartsAndMenu(menuPartialMetadata, fullMetadata, hasKubernetes),
    [menuPartialMetadata, fullMetadata, hasKubernetes]
  )
  const main = useMemo(() => sortObjectByPriority(menus), [menus])

  return [main, menus]
}
