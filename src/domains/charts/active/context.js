import React, { useState, useMemo } from "react"
import { createContext } from "use-context-selector"
import useContext from "@/src/hooks/useContextSelector"

export const ActiveDispatchContext = createContext("")
export const ActiveMenuGroupIdContext = createContext("")
export const ActiveSubMenuIdContext = createContext("")

export const ActiveMenuProvider = ({
  menuGroupId: initialMenuGroupId = "",
  subMenuId: initialSubMenuId = "",
  children,
}) => {
  const [menuGroupId, setMenuGroupId] = useState(initialMenuGroupId)
  const [subMenuId, setSubMenuId] = useState(initialSubMenuId)

  const dispatch = useMemo(
    () => ({
      setMenuGroupId,
      setSubMenuId,
    }),
    []
  )

  return (
    <ActiveDispatchContext.Provider value={dispatch}>
      <ActiveMenuGroupIdContext.Provider value={menuGroupId}>
        <ActiveSubMenuIdContext.Provider value={subMenuId}>
          {children}
        </ActiveSubMenuIdContext.Provider>
      </ActiveMenuGroupIdContext.Provider>
    </ActiveDispatchContext.Provider>
  )
}

export const useDispatchActive = () => useContext(ActiveDispatchContext)

export const useActiveMenuGroupId = select => useContext(ActiveMenuGroupIdContext, select)

export const useMenuGroupActive = id => useActiveMenuGroupId(state => id === state)

export const useActiveSubMenuId = select => useContext(ActiveSubMenuIdContext, select)

export const withActiveMenuGroupId = Component => props => {
  const activeMenuGroupId = useActiveMenuGroupId()
  return <Component activeMenuGroupId={activeMenuGroupId} {...props} />
}

export const withActiveSubMenuId = Component => props => {
  const activeSubMenuId = useActiveSubMenuId()
  return <Component activeSubMenuId={activeSubMenuId} {...props} />
}
