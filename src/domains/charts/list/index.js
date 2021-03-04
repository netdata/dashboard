import React, { createContext, useContext, useState } from "react"

export const ListContext = createContext()
export const DispatchListContext = createContext()

export const ListProvider = ({ children }) => {
  const [value, setValue] = useState()

  return (
    <ListContext.Provider value={value}>
      <DispatchListContext.Provider value={setValue}>{children}</DispatchListContext.Provider>
    </ListContext.Provider>
  )
}

export const useList = () => useContext(ListContext)

export const useDispatchList = () => useContext(DispatchListContext)
