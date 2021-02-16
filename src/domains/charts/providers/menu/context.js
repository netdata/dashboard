import React, { createContext } from "react"

export const MenuContext = createContext([])

export const MenuProvider = ({ menuIds, children }) => (
  <MenuContext.Provider value={menuIds}>{children}</MenuContext.Provider>
)

export const MenuConsumer = ({ children }) => (
  <MenuContext.Consumer>{menuIds => children(menuIds)}</MenuContext.Consumer>
)
