import React from "react"
import { identity } from "ramda"
import { createContext } from "use-context-selector"
import useContextSelector from "@/src/hooks/useContextSelector"
// priority
// chartIds
// headIds
// title
// info
// height
// chartSubMenuId
// link

export const SubMenuByIdContext = createContext({})

export const SubMenuByIdProvider = ({ subMenuById, children }) => (
  <SubMenuByIdContext.Provider value={subMenuById}>{children}</SubMenuByIdContext.Provider>
)

export const useSubMenus = selector => useContextSelector(SubMenuByIdContext, selector)

export const useSubMenu = (id, selector = identity) => useSubMenus(state => selector(state[id]))

export const withSubMenu = (Component, select) => ({ id, ...rest }) => {
  const subMenus = useSubMenu(id, select)
  return <Component {...subMenus} {...rest} />
}
