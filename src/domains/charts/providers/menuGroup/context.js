import React from "react"
import { identity } from "ramda"
import { createContext } from "use-context-selector"
import useContext from "@/src/hooks/useContextSelector"

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

export const useMenuGroup = (id, selector = identity) =>
  useContext(MenuGroupContext, state => selector(state[id]))

export const withMenuGroup = (Component, select) => ({ id, ...rest }) => {
  const menuGroups = useMenuGroup(id, select)
  return <Component {...menuGroups} {...rest} />
}
