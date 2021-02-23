/* eslint-disable arrow-body-style */
import React from "react"
import classNames from "classnames"

import { name2id } from "utils/name-2-id"
import truncateMiddle from "utils/truncateMiddle"

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

  const getEventName = (value: string) => {
    return value.startsWith("Kubernetes") ? "k8s" : value.replace(/[^\w]/g, "-").toLowerCase()
  }

  const onMenuClick = (event: React.MouseEvent) => {
    handleScrollToId(event)
    reportEvent("metric-sidebar", `click-${getEventName(menu.title)}`)
  }

  const onSubmenuClick = (event: React.MouseEvent, title: string) => {
    handleScrollToId(event)
    reportEvent("metric-sidebar", `click-${getEventName(menu.title)}`, getEventName(title))
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
        title={menu.title}
      >
        {/* eslint-disable-next-line react/no-danger */}
        <span dangerouslySetInnerHTML={{ __html: menu.icon }} />
        {" "}
        {truncateMiddle(menu.title, 30)}
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
                // @ts-ignore
                onClick={(e) => onSubmenuClick(e, submenu.title)}
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
