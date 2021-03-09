import { useRef, useCallback, useLayoutEffect } from "react"
import {
  useMenuGroups,
  useSubMenus,
  useList,
  useDispatchActive,
  useContainer,
} from "@/src/domains/charts"

const getElement = action => (container, query) => {
  const element = container.querySelector(query)
  if (element) action(element)
}
const scrollIntoView =
  "scrollIntoViewIfNeeded" in document.body
    ? getElement(element => element.scrollIntoViewIfNeeded())
    : getElement(element => element.scrollIntoView())

export default ({ onMenuGroupClick, onSubMenuClick, onChartNameChange, initialChartName }) => {
  const container = useContainer()
  const list = useList()
  const menuGroups = useMenuGroups()
  const subMenus = useSubMenus()
  const { setMenuGroupId, setSubMenuId } = useDispatchActive()

  const initialScrollRef = useRef(initialChartName)

  const setActiveMenuGroupId = useCallback(
    id => {
      if (initialScrollRef.current) return

      setMenuGroupId(id)
      scrollIntoView(container, `[data-sidebar-menugroupid="${id}"]`)

      if (id && menuGroups[id]) onChartNameChange(menuGroups[id].link)
    },
    [menuGroups]
  )

  const setActiveSubMenuId = useCallback(
    id => {
      if (initialScrollRef.current) return
      setSubMenuId(id)

      if (!(id in subMenus)) return

      setMenuGroupId(subMenus[id].menuGroupId)
      scrollIntoView(container, `[data-sidebar-submenuid="${id}"]`)
      onChartNameChange(subMenus[id].link)
    },
    [subMenus]
  )

  useLayoutEffect(() => {
    if (!initialScrollRef.current || !list) return

    initialScrollRef.current = null
    list.goToLink(initialChartName)
  }, [list])

  const menuGroupClick = useCallback(
    (id, event) => {
      event.preventDefault()
      list.goToMenuGroup(id)
      onMenuGroupClick(id)
    },
    [list]
  )

  const subMenuClick = useCallback(
    (id, subMenuId, event) => {
      event.preventDefault()
      list.goToSubMenu(subMenuId)
      onSubMenuClick(id, subMenuId)
    },
    [list]
  )

  return {
    setActiveMenuGroupId,
    setActiveSubMenuId,
    onMenuGroupClick: menuGroupClick,
    onSubMenuClick: subMenuClick,
  }
}
