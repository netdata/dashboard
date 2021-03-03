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

export const MenuGroupById = createContext({})

export const MenuGroupProvider = ({ menuGroupById, children }) => (
  <MenuGroupById.Provider value={menuGroupById}>{children}</MenuGroupById.Provider>
)

export const useMenuGroups = () => useContext(MenuGroupById)

export const useMenuGroup = (id, selector = identity) =>
  useContext(MenuGroupById, state => selector(state[id]))

export const withMenuGroup = (Component, select) => ({ id, ...rest }) => {
  const menuGroups = useMenuGroup(id, select)
  return <Component {...menuGroups} {...rest} />
}

export const MenuGroupIdsContext = createContext([])

export const MenuGroupIdsProvider = ({ ids, children }) => (
  <MenuGroupIdsContext.Provider value={ids}>{children}</MenuGroupIdsContext.Provider>
)

export const useMenuGroupIds = selector => useContext(MenuGroupIdsContext, selector)

export const withMenuGroupIds = Component => props => {
  const ids = useMenuGroupIds()
  return <Component menuGroupIds={ids} {...props} />
}
