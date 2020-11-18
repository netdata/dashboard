import React, { useCallback } from "react"
import classNames from "classnames"

import { name2id } from "utils/name-2-id"

import { ReportEvent } from "types/report"

import { sortObjectByPriority } from "../../utils/sorting"
import { Menus } from "../../utils/netdata-dashboard"


interface RenderSingleMenuArgument {
  currentChart: string
  handleScrollToId: (event: React.MouseEvent) => void
  menus: Menus
  reportEvent: ReportEvent
}
export const renderSingleMenu = ({
  currentChart,
  handleScrollToId,
  menus,
  reportEvent,
}: RenderSingleMenuArgument) => (menuName: string) => {
  const menu = menus[menuName]
  const menuID = name2id(`menu_${menuName}`)
  const submenuNames = sortObjectByPriority(menu.submenus)

  const onMenuClick = (event: React.MouseEvent) => {
    handleScrollToId(event)
    const name = menu.title.replace(/[^\w]/g, "-").toLowerCase()
    reportEvent("metric-sidebar", `click-${name}`)
  }

  // currentChart could be either just menu name "menu_ipv4"
  // or menu + submenu - "menu_ipv4_submenu_sockets"
  const isMenuActive = currentChart.startsWith(`${menuID}_submenu_`) || currentChart === menuID
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
        onClick={onMenuClick}
      >
        {/* eslint-disable-next-line react/no-danger */}
        <span dangerouslySetInnerHTML={{ __html: menu.icon }} />
        {" "}
        {menu.title}
        {menu.correlationsMetadata && (
          ` (${menu.correlationsMetadata.scoredCount}/${menu.correlationsMetadata.totalCount})`
        )}
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
}
