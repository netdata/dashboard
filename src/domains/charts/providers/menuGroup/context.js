import React, { createContext } from "react"

export const MenuGroupContext = createContext({})

export const MenuGroupProvider = ({ menuGroups, children }) => (
  <MenuGroupContext.Provider value={menuGroups}>{children}</MenuGroupContext.Provider>
)

export const MenuGroupConsumer = ({ id, children }) => (
  <MenuGroupContext.Consumer>{menuGroup => children(menuGroup[id])}</MenuGroupContext.Consumer>
)
