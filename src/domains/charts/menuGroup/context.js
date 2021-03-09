import React from "react"
import { identity } from "ramda"
import { createContext } from "use-context-selector"
import useContext from "@/src/hooks/useContextSelector"

// menuPattern
// priority
// headIds
// subMenuIds
// subMenuChartIds
// title
// icon
// info
// height
// link

export const MenuGroupByIdContext = createContext({})

export const MenuGroupProvider = ({ menuGroupById, children }) => (
  <MenuGroupByIdContext.Provider value={menuGroupById}>{children}</MenuGroupByIdContext.Provider>
)

export const useMenuGroups = selector => useContext(MenuGroupByIdContext, selector)

export const useMenuGroup = (id, selector = identity) => useMenuGroups(state => selector(state[id]))

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
