/* eslint-disable implicit-arrow-linebreak */
import { omit, pipe, mergeDeepLeft } from "ramda"

type HashParams = { [param: string]: string }

export const getHashParams = (hash?: string): HashParams => {
  const safeHash = hash || decodeURIComponent(window.location.hash.substr(1))
  if (safeHash.length === 0) {
    return {}
  }
  const params = safeHash.split("&")
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
  return entries.map((entry) => entry.join("=")).join("&")
}

export const getFilteredHash = (excludedParams: string[]) => {
  const filteredParams = omit(excludedParams, getHashParams())
  return makeHashFromObject(filteredParams)
}

export const getUniqueParamsHash = pipe(getHashParams, makeHashFromObject)

export const setHashParams = (params: { [paramKey: string]: string }) => {
  const allParams = getHashParams()
  const allParamsResult = mergeDeepLeft(params, allParams)
  // window.history.replaceState(null, "", `#${makeHashFromObject(allParams)}`)
  window.location.hash = `${makeHashFromObject(allParamsResult)}`
}

export const getHashParam = (param: string): string => getHashParams()[param] || ""

export const removeHashParams = (params: string[]) => {
  window.location.hash = `${getFilteredHash(params)}`
}
