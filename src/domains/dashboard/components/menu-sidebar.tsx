import React from "react"
import classNames from "classnames"

import { name2id } from "utils/name-2-id"
import { sortObjectByPriority } from "domains/dashboard/utils/sorting"
import { Menus } from "domains/dashboard/utils/netdata-dashboard"

interface Props {
  currentChart: string
  menuNames: string[]
  menus: Menus
}
export const MenuSidebar = ({
  currentChart,
  menuNames,
  menus,
}: Props) => {
  const handleScrollToId = (event: React.MouseEvent) => {
    event.preventDefault()
    const chartNodeId = event.currentTarget.getAttribute("href")
    if (chartNodeId) {
      const node = document.getElementById(chartNodeId.replace("#", ""))
      if (node) {
        node.scrollIntoView()
      }
    }
  }


  return (
    <div className="node-view__sidebar" role="complementary">
      <ul className="nav dashboard-sidenav">
        {menuNames.map((menuName) => {
          const menu = menus[menuName]
          const menuID = name2id(`menu_${menuName}`)
          const submenuNames = sortObjectByPriority(menu.submenus)
          const isMenuActive = currentChart.startsWith(menuID)
          return (
            <li
              key={menuName}
              className={classNames(
                "node-view__sidebar-menu-li",
                { "node-view__sidebar-menu-li--active": isMenuActive },
              )}
            >
              <a
                className="node-view__sidebar-link"
                href={`#${menuID}`}
                onClick={handleScrollToId}
              >
                {/* eslint-disable-next-line react/no-danger */}
                <span dangerouslySetInnerHTML={{ __html: menu.icon }} />
                {" "}
                {menu.title}
              </a>
              <ul
                className={classNames(
                  "node-view__sidebar-submenu",
                )}
              >
                {submenuNames.map((submenuName) => {
                  const submenuID = name2id(`menu_${menuName}_submenu_${submenuName}`)
                  const submenu = menu.submenus[submenuName]
                  const isSubmenuActive = submenuID === currentChart
                  return (
                    <li
                      key={submenuName}
                      className={classNames(
                        "node-view__sidebar-submenu-li",
                        { "node-view__sidebar-submenu-li--active": isSubmenuActive },
                      )}
                    >
                      <a
                        className="node-view__sidebar-link"
                        href={`#${submenuID}`}
                        onClick={handleScrollToId}
                      >
                        {submenu.title}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
