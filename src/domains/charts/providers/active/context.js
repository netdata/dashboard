import React, { createContext, useContext, useMemo } from "react"

export const ActiveMenuContext = createContext({
  menuId: "",
  subMenuId: "",
})

export const ActiveMenuProvider = ({ menuId = "", subMenuId = "", children }) => {
  const value = useMemo(() => ({ menuId, subMenuId }), [menuId, subMenuId])
  return <ActiveMenuContext.Provider value={value}>{children}</ActiveMenuContext.Provider>
}

export const ActiveMenuConsumer = ({ children }) => (
  <ActiveMenuContext.Consumer>{activeMenu => children(activeMenu)}</ActiveMenuContext.Consumer>
)

export const withActiveMenu = Component => props => {
  const { menuId, subMenuId } = useContext(ActiveMenuContext)
  return <Component activeMenuId={menuId} activeSubMenuId={subMenuId} {...props} />
}
