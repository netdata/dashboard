import React, { createContext, useContext } from "react"

export const MenuContext = createContext([])

export const MenuProvider = ({ menuIds, children }) => (
  <MenuContext.Provider value={menuIds}>{children}</MenuContext.Provider>
)

export const withMenu = Component => props => {
  const menuIds = useContext(MenuContext)
  return <Component menuIds={menuIds} {...props} />
}
