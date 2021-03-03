import React, { useMemo } from "react"
import getMenu from "../getMenu"
import {
  ChartsProvider,
  MenuProvider,
  MenuGroupProvider,
  SubMenuProvider,
  ActiveMenuProvider,
  ListProvider,
} from "domains/charts/providers"

const Provider = ({
  container,
  activeMenuId,
  activeSubMenuId,
  chartIds,
  getChart,
  getChartAttributes,
  onAttributesChange,
  dashboardAttributes,
  hasKubernetes,
  children,
}) => {
  const {
    menusCollection,
    menuGroupsCollection,
    subMenusCollection,
    menuChartsAttributes,
  } = useMemo(() => getMenu(chartIds, getChart, { hasKubernetes }), [chartIds, getChart])

  return (
    <ChartsProvider
      container={container}
      menuChartsAttributes={menuChartsAttributes}
      getChartAttributes={getChartAttributes}
      onAttributesChange={onAttributesChange}
      getChart={getChart}
      dashboardAttributes={dashboardAttributes}
    >
      <MenuProvider menuIds={menusCollection}>
        <MenuGroupProvider menuGroups={menuGroupsCollection}>
          <SubMenuProvider subMenus={subMenusCollection}>
            <ActiveMenuProvider menuId={activeMenuId} subMenuId={activeSubMenuId}>
              <ListProvider>{children}</ListProvider>
            </ActiveMenuProvider>
          </SubMenuProvider>
        </MenuGroupProvider>
      </MenuProvider>
    </ChartsProvider>
  )
}

export default Provider
