import React, { createContext, useContext } from "react"

export const MenuGroupContext = createContext({})

export const MenuGroupProvider = ({ menuGroups, children }) => (
  <MenuGroupContext.Provider value={menuGroups}>{children}</MenuGroupContext.Provider>
)

export const withMenuGroup = Component => ({ id, ...rest }) => {
  const menuGroups = useContext(MenuGroupContext)
  return <Component {...menuGroups[id]} {...rest} />
}
