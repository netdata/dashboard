import { createContext } from "react"
import {
  createDispatchHook, createSelectorHook, ReactReduxContextValue,
  useSelector as useSelectorOriginal,
  useDispatch as useDispatchOriginal,
} from "react-redux"

const shouldUseDefaultContext = process.env.REACT_APP_SHOULD_USE_DEFAULT_CONTEXT

export const dashboardReduxContext = shouldUseDefaultContext
  ? null
  : createContext<ReactReduxContextValue>(undefined as any)

export const useSelector = dashboardReduxContext
  ? createSelectorHook(dashboardReduxContext)
  : useSelectorOriginal
export const useDispatch = dashboardReduxContext
  ? createDispatchHook(dashboardReduxContext)
  : useDispatchOriginal
