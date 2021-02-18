import React, { createContext, useContext } from "react"

export const SubMenuContext = createContext({})

export const SubMenuProvider = ({ subMenus, children }) => (
  <SubMenuContext.Provider value={subMenus}>{children}</SubMenuContext.Provider>
)

export const withSubMenu = Component => ({ id, ...rest }) => {
  const subMenus = useContext(SubMenuContext)
  return <Component {...subMenus[id]} {...rest} />
}
