import React, { useMemo } from "react"
import getMenu from "../getMenu"
import {
  ChartsProvider,
  MenuProvider,
  MenuGroupProvider,
  SubMenuProvider,
  ActiveMenuProvider,
} from "domains/charts/providers"

const Provider = ({ activeMenuId, activeSubMenuId, chartIds, getChart, children }) => {
  const { menusCollection, menuGroupsCollection, subMenusCollection, charts } = useMemo(
    () => getMenu(chartIds, getChart),
    [chartIds, getChart]
  )

  return (
    <ChartsProvider charts={charts} getChart={getChart}>
      <MenuProvider menuIds={menusCollection}>
        <MenuGroupProvider menuGroups={menuGroupsCollection}>
          <SubMenuProvider subMenus={subMenusCollection}>
            <ActiveMenuProvider menuId={activeMenuId} subMenuId={activeSubMenuId}>
              {children}
            </ActiveMenuProvider>
          </SubMenuProvider>
        </MenuGroupProvider>
      </MenuProvider>
    </ChartsProvider>
  )
}

export default Provider
