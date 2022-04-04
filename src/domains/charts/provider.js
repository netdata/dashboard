import React, { useMemo } from "react"
import getMenu from "./getMenu"
import { ChartsProvider } from "./charts"
import { MenuGroupIdsProvider, MenuGroupProvider } from "./menuGroup"
import { SubMenuByIdProvider } from "./subMenu"
import { ActiveMenuProvider } from "./active"
import { ListProvider } from "./list"

const Provider = ({
  container,
  activeMenuGroupId,
  activeSubMenuId,
  chartIds,
  getChart,
  dashboardAttributes,
  hasKubernetes,
  composite,
  children,
}) => {
  const { menuGroupIds, menuGroupById, subMenuById, menuChartsAttributeById } = useMemo(
    () => getMenu(chartIds, getChart, { hasKubernetes, composite }),
    [chartIds, getChart]
  )

  return (
    <ChartsProvider
      container={container}
      menuChartsAttributeById={menuChartsAttributeById}
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
