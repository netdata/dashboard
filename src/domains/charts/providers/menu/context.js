import React from "react"
import { createContext } from "use-context-selector"
import useContext from "@/src/hooks/useContextSelector"

export const MenuContext = createContext([])

export const MenuProvider = ({ menuIds, children }) => (
  <MenuContext.Provider value={menuIds}>{children}</MenuContext.Provider>
)

export const useMenuIds = selector => useContext(MenuContext, selector)

export const withMenu = Component => props => {
  const menuIds = useMenuIds()
  return <Component menuIds={menuIds} {...props} />
}
