import {
  Subject, from, empty,
} from "rxjs"
import {
  mergeMap, tap, catchError, startWith, switchMap,
} from "rxjs/operators"

import { UnknownStringKeyT } from "types/common"

import { axiosInstance } from "./axios-instance"

interface FetchInputEvent {
  url: string
  params: UnknownStringKeyT
  onErrorCallback: (data?: { [key: string]: unknown }) => void
  onSuccessCallback: (data: { [key: string]: unknown }) => void
}

const METRICS_TIMEOUT = 15_000

export const getFetchStream = (concurrentCallsLimit: number) => {
  const fetch$ = new Subject<FetchInputEvent>()
  const resetFetch$ = new Subject()

  const handler = mergeMap(({
    url, params, onErrorCallback, onSuccessCallback,
  }: FetchInputEvent) => (
    from(axiosInstance.get(url, { params, timeout: METRICS_TIMEOUT })).pipe(
      tap(({ data }) => { onSuccessCallback(data) }),
      catchError(() => {
        // todo implement error handling to support NETDATA.options.current.retries_on_data_failures
        console.warn("fetch error", url) // eslint-disable-line
        onErrorCallback()
        return empty()
      }),
    )
  ), concurrentCallsLimit)

  const output = resetFetch$.pipe(
    startWith(null),
    switchMap(() => fetch$.pipe(handler)),
  )

  output.subscribe()
  return [fetch$, resetFetch$]
}
