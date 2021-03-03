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

export const SubMenuContext = createContext({})

export const SubMenuProvider = ({ subMenus, children }) => (
  <SubMenuContext.Provider value={subMenus}>{children}</SubMenuContext.Provider>
)

export const useSubMenus = selector => useContextSelector(SubMenuContext, selector)

export const useSubMenu = (id, selector = identity) => {
  return useSubMenus(state => {
    return selector(state[id])
  })
}

export const withSubMenu = (Component, select) => ({ id, ...rest }) => {
  const subMenus = useSubMenu(id, select)
  return <Component {...subMenus} {...rest} />
}
