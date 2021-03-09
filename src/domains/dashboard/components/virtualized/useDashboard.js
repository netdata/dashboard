import { useRef, useCallback, useLayoutEffect } from "react"
import { useMenuGroups, useSubMenus, useList, useDispatchActive } from "@/src/domains/charts"

export default ({ onMenuGroupClick, onSubMenuClick, onChartNameChange, initialChartName }) => {
  const list = useList()
  const menuGroups = useMenuGroups()
  const subMenus = useSubMenus()
  const { setMenuGroupId, setSubMenuId } = useDispatchActive()

  const initialScrollRef = useRef(initialChartName)

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
