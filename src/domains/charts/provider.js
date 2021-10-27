import React, { useMemo } from "react"
import getMenu from "./getMenu"
import { ChartsProvider } from "./charts"
import { MenuGroupIdsProvider, MenuGroupProvider } from "./menuGroup"
import { SubMenuByIdProvider } from "./subMenu"
import { ActiveMenuProvider } from "./active"
import { ListProvider } from "./list"

export const Provider = ({
  container,
  activeMenuGroupId,
  activeSubMenuId,
  getChart,
  dashboardAttributes,
  menuGroupIds,
  menuGroupById,
  subMenuById,
  menuChartsAttributeById,
  children,
}) => {
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

const ProviderContainer = ({
  container,
  activeMenuGroupId,
  activeSubMenuId,
  chartIds,
  getChart,
  dashboardAttributes,
  hasKubernetes,
  children,
}) => {
  const { menuGroupIds, menuGroupById, subMenuById, menuChartsAttributeById } = useMemo(
    () => getMenu(chartIds, getChart, { hasKubernetes }),
    [chartIds, getChart]
  )

  return (
    <Provider
      container={container}
      activeMenuGroupId={activeMenuGroupId}
      activeSubMenuId={activeSubMenuId}
      getChart={getChart}
      dashboardAttributes={dashboardAttributes}
      menuGroupIds={menuGroupIds}
      menuGroupById={menuGroupById}
      subMenuById={subMenuById}
      menuChartsAttributeById={menuChartsAttributeById}
    >
      {children}
    </Provider>
  )
}

export default ProviderContainer
