import { useRef, useCallback, useLayoutEffect } from "react"
import { useMenuGroups, useSubMenus, useList, useDispatchActive } from "@/src/domains/charts"

export default ({ onMenuGroupClick, onSubMenuClick, onChartNameChange, initialChartName }) => {
  const list = useList()
  const menuGroups = useMenuGroups()
  const subMenus = useSubMenus()
  const { setMenuGroupId, setSubMenuId } = useDispatchActive()

  const setActiveMenuGroupId = useCallback(
    id => {
      if (initialScrollRef.current) return
      setMenuGroupId(id)

      if (id && menuGroups[id]) onChartNameChange(menuGroups[id].link)
    },
    [menuGroups]
  )

  const setActiveSubMenuId = useCallback(
    id => {
      if (initialScrollRef.current) return
      setSubMenuId(id)

      if (id && subMenus[id]) {
        setMenuGroupId(subMenus[id].menuGroupId)
        onChartNameChange(subMenus[id].link)
      }
    },
    [subMenus]
  )

  const initialScrollRef = useRef(initialChartName)
  useLayoutEffect(() => {
    if (!initialScrollRef.current || !list) return

    initialScrollRef.current = null

    const menuGroupId = Object.keys(menuGroups).find(id => menuGroups[id].link === initialChartName)
    if (menuGroupId) {
      list.goToMenuGroup(menuGroupId)
      setActiveMenuGroupId(menuGroupId)
      return
    }

    const subMenuId = Object.keys(subMenus).find(id => subMenus[id].link === initialChartName)
    if (subMenuId) {
      list.goToMenuGroup(subMenus[subMenuId].menuGroupId).then(() => {
        list.goToSubMenu(subMenuId)
        setActiveMenuGroupId(subMenus[subMenuId].menuGroupId)
        setActiveSubMenuId(subMenuId)
      })
      return
    }
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
