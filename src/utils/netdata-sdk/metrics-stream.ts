import {
  Subject, from, empty,
} from "rxjs"
import {
  mergeMap, tap, catchError, startWith, switchMap,
} from "rxjs/operators"
import { CancelTokenSource } from "axios"

import { UnknownStringKeyT } from "types/common"

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
        // todo implement error handling to support NETDATA.options.current.retries_on_data_failures
        if (error?.message !== CHART_UNMOUNTED) {
          console.warn("fetch error", url) // eslint-disable-line no-console
        }
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
