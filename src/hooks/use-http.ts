import { useEffect, useState } from "react"

import { axiosInstance } from "utils/api"

export const useHttp = <T = unknown>(
  url: string | undefined,
  shouldMakeCall : boolean = true,
  isExternal?: boolean,
) => {
  const [isFetching, setIsFetching] = useState(false)
  const [isError, setIsError] = useState(false)
  const [data, setData] = useState<T | null>(null)
  useEffect(() => {
    if (shouldMakeCall && url) {
      const options = isExternal
        ? { headers: null, withCredentials: false }
        : {}

      setIsFetching(true)
      axiosInstance.get(url, options)
        .then((r) => {
          if (r.data) {
            setData(r.data)
            setIsError(false)
            setIsFetching(false)
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.warn(`error fetching ${url}`, error)
          setIsError(true)
          setIsFetching(false)
        })
    }
  }, [isExternal, shouldMakeCall, url])
  // force triple instead of array
  return [data, isFetching, isError] as [T | null, boolean, boolean]
}
