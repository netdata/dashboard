import React, { createContext } from "react"

export const SubMenuContext = createContext({})

export const SubMenuProvider = ({ subMenus, children }) => (
  <SubMenuContext.Provider value={subMenus}>{children}</SubMenuContext.Provider>
)

export const SubMenuConsumer = ({ id, children }) => (
  <SubMenuContext.Consumer>{subMenus => children(subMenus[id])}</SubMenuContext.Consumer>
)
