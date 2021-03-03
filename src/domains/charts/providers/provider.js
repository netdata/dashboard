import React, { useMemo } from "react"
import getMenu from "../getMenu"
import {
  ChartsProvider,
  MenuGroupIdsProvider,
  MenuGroupProvider,
  SubMenuByIdProvider,
  ActiveMenuProvider,
  ListProvider,
} from "domains/charts/providers"

const Provider = ({
  container,
  activeMenuGroupId,
  activeSubMenuId,
  chartIds,
  getChart,
  getChartAttributes,
  onAttributesChange,
  dashboardAttributes,
  hasKubernetes,
  children,
}) => {
  const { menuGroupIds, menuGroupById, subMenuById, menuChartsAttributeById } = useMemo(
    () => getMenu(chartIds, getChart, { hasKubernetes }),
    [chartIds, getChart]
  )

  return (
    <ChartsProvider
      container={container}
      menuChartsAttributeById={menuChartsAttributeById}
      getChartAttributes={getChartAttributes}
      onAttributesChange={onAttributesChange}
      getChart={getChart}
      dashboardAttributes={dashboardAttributes}
    >
      <MenuGroupIdsProvider ids={menuGroupIds}>
        <MenuGroupProvider menuGroupById={menuGroupById}>
          <SubMenuByIdProvider subMenuById={subMenuById}>
            <ActiveMenuProvider menuGroupId={activeMenuGroupId} subMenuId={activeSubMenuId}>
              <ListProvider>{children}</ListProvider>
            </ActiveMenuProvider>
          </SubMenuByIdProvider>
        </MenuGroupProvider>
      </MenuGroupIdsProvider>
    </ChartsProvider>
  )
}

export default Provider
