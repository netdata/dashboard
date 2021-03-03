import React from "react"
import { createContext } from "use-context-selector"
import useContext from "@/src/hooks/useContextSelector"

export const ActiveMenuIdContext = createContext("")
export const ActiveSubMenuIdContext = createContext("")

export const ActiveMenuProvider = ({ menuId = "", subMenuId = "", children }) => (
  <ActiveMenuIdContext.Provider value={menuId}>
    <ActiveSubMenuIdContext.Provider value={subMenuId}>{children}</ActiveSubMenuIdContext.Provider>
  </ActiveMenuIdContext.Provider>
)

export const useActiveMenuId = select => useContext(ActiveMenuIdContext, select)

export const useActiveSubMenuId = select => useContext(ActiveSubMenuIdContext, select)

export const withActiveMenuId = Component => props => {
  const activeMenuId = useActiveMenuId()
  return <Component activeMenuId={activeMenuId} {...props} />
}

export const withActiveSubMenuId = Component => props => {
  const activeSubMenuId = useActiveSubMenuId()
  return <Component activeSubMenuId={activeSubMenuId} {...props} />
}
