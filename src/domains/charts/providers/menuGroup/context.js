import React, { createContext, useContext } from "react"

// menuPattern
// priority
// headIds
// subMenuIds
// title
// icon
// info
// height
// link

export const MenuGroupContext = createContext({})

export const MenuGroupProvider = ({ menuGroups, children }) => (
  <MenuGroupContext.Provider value={menuGroups}>{children}</MenuGroupContext.Provider>
)

export const useMenuGroups = () => useContext(MenuGroupContext)

export const useMenuGroup = (id, key) => {
  const resource = useContext(MenuGroupContext)[id]
  return key ? resource[key] : resource
}

export const withMenuGroup = (Component, select) => ({ id, ...rest }) => {
  const menuGroups = useMenuGroup(id)
  return <Component {...(select ? select(menuGroups) : menuGroups)} {...rest} />
}
