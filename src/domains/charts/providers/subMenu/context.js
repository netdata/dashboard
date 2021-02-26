import React, { createContext, useContext } from "react"

// priority
// chartIds
// headIds
// title
// info
// height
// chartSubMenuId
// link

export const SubMenuContext = createContext({})

export const SubMenuProvider = ({ subMenus, children }) => (
  <SubMenuContext.Provider value={subMenus}>{children}</SubMenuContext.Provider>
)

export const useSubMenus = () => useContext(SubMenuContext)

export const useSubMenu = (id, key) => {
  const resource = useSubMenus()[id]
  return key ? resource[key] : resource
}

export const withSubMenu = Component => ({ id, ...rest }) => {
  const subMenus = useSubMenu(id)
  return <Component {...subMenus} {...rest} />
}
