import { createContext } from "react"
import { createDispatchHook, createSelectorHook } from "react-redux"

const shouldUseDefaultContext = process.env.REACT_APP_SHOULD_USE_DEFAULT_CONTEXT

export const dashboardReduxContext = shouldUseDefaultContext
  ? null
  : createContext(undefined)

export const useSelector = createSelectorHook(dashboardReduxContext)
export const useDispatch = createDispatchHook(dashboardReduxContext)
