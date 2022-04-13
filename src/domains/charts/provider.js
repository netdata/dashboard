import React, { memo, useMemo } from "react"
import { usePrevious } from "react-use"
import getMenu from "./getMenu"
import { ChartsProvider } from "./charts"
import { MenuGroupIdsProvider, MenuGroupProvider } from "./menuGroup"
import { SubMenuByIdProvider } from "./subMenu"
import { ActiveMenuProvider } from "./active"
import { ListProvider } from "./list"

const Provider = memo(
  ({
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
      [chartIds.length]
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
  },
  (prev, next) =>
    prev.chartIds.length === next.chartIds.length && prev.activeSubMenuId === next.activeSubMenuId
)

export default Provider
