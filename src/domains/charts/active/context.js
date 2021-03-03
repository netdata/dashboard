import React from "react"
import { createContext } from "use-context-selector"
import useContext from "@/src/hooks/useContextSelector"

export const ActiveMenuGroupIdContext = createContext("")
export const ActiveSubMenuIdContext = createContext("")

export const ActiveMenuProvider = ({ menuGroupId = "", subMenuId = "", children }) => (
  <ActiveMenuGroupIdContext.Provider value={menuGroupId}>
    <ActiveSubMenuIdContext.Provider value={subMenuId}>{children}</ActiveSubMenuIdContext.Provider>
  </ActiveMenuGroupIdContext.Provider>
)

export const useActiveMenuGroupId = select => useContext(ActiveMenuGroupIdContext, select)

export const useActiveSubMenuId = select => useContext(ActiveSubMenuIdContext, select)

export const withActiveMenuGroupId = Component => props => {
  const activeMenuGroupId = useActiveMenuGroupId()
  return <Component activeMenuGroupId={activeMenuGroupId} {...props} />
}

export const withActiveSubMenuId = Component => props => {
  const activeSubMenuId = useActiveSubMenuId()
  return <Component activeSubMenuId={activeSubMenuId} {...props} />
}
