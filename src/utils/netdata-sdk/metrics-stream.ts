import {
  Subject, from, empty,
} from "rxjs"
import {
  mergeMap, tap, catchError, startWith, switchMap,
} from "rxjs/operators"

import { UnknownStringKeyT } from "types/common"

import { CancelTokenSource } from "axios"
import { axiosInstance } from "./axios-instance"

export const CHART_UNMOUNTED = "Chart scrolled out of view"

interface FetchInputEvent {
  url: string
  params: UnknownStringKeyT
  onErrorCallback: (data?: { [key: string]: unknown }) => void
  onSuccessCallback: (data: { [key: string]: unknown }) => void
  cancelTokenSource?: CancelTokenSource
}

const METRICS_TIMEOUT = 15_000

export const getFetchStream = (concurrentCallsLimit: number) => {
  const fetch$ = new Subject<FetchInputEvent>()
  const resetFetch$ = new Subject()

  const handler = mergeMap(({
    url, params, onErrorCallback, onSuccessCallback, cancelTokenSource,
  }: FetchInputEvent) => (
    from(axiosInstance.get(url, {
      params, timeout: METRICS_TIMEOUT, cancelToken: cancelTokenSource?.token,
    })).pipe(
      tap(({ data }) => { onSuccessCallback(data) }),
      catchError((error) => {
        if (error?.message === CHART_UNMOUNTED) {
          return empty()
        }
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
