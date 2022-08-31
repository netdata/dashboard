/* eslint-disable comma-dangle */
/* eslint-disable implicit-arrow-linebreak */
import { omit, pipe, mergeDeepLeft } from "ramda"

type HashParams = { [param: string]: string }
const fragmentParamsSeparatorRegEx = /[&;]/
const fragmentParamsSeparator = ";"

export const getHashParams = (
  hash = decodeURIComponent(window.location.hash.substr(1))
): HashParams => {
  if (hash.length === 0) {
    return {}
  }
  const params = hash.split(fragmentParamsSeparatorRegEx)
  const response = params.reduce((acc: HashParams, current) => {
    const parts = current.split("=")
    const [param, value] = parts
    acc[param] = value
    return acc
  }, {})
  return response
}

export const makeHashFromObject = (params: { [paramKey: string]: string }) => {
  const entries = Object.entries(params)
  if (entries.length === 0) {
    return ""
  }
  return entries
    .map(([key, value]) => value !== undefined ? `${key}=${encodeURIComponent(value)}` : key)
    .join(fragmentParamsSeparator)
}

export const getFilteredHash = (
  excludedParams: string[],
  hash = decodeURIComponent(window.location.hash.substr(1))
) => {
  const filteredParams = omit(excludedParams, getHashParams(hash))
  return makeHashFromObject(filteredParams)
}

export const getUniqueParamsHash = pipe(getHashParams, makeHashFromObject)

export const setHashParams = (params: { [paramKey: string]: string }) => {
  const allParams = getHashParams()
  const allParamsResult = mergeDeepLeft(params, allParams)
  window.history.replaceState(window.history.state, "", `#${makeHashFromObject(allParamsResult)}`)
}

export const getHashParam = (
  param: string,
  hash = decodeURIComponent(window.location.hash.substr(1))
): string => getHashParams(hash)[param]

export const hasHashParam = (
  param: string,
  hash = decodeURIComponent(window.location.hash.substr(1))
): boolean => getHashParams(hash)[param] !== undefined

export const removeHashParams = (params: string[]) => {
  window.history.replaceState(window.history.state, "", `#${getFilteredHash(params)}`)
}
