import { Subject, from, empty } from "rxjs"
import {
  mergeMap, tap, catchError,
} from "rxjs/operators"

import { axiosInstance } from "./axios-instance"

const CONCURRENT_CALLS_LIMIT = 20

interface FetchInputEvent {
  url: string
  params: { [key: string]: unknown }
  onErrorCallback: (data?: { [key: string]: unknown }) => void
  onSuccessCallback: (data: { [key: string]: unknown }) => void
}

const stream = new Subject<FetchInputEvent>()

export const fetchMetricsStream = stream

const output = stream.pipe(
  mergeMap(({
    url, params, onErrorCallback, onSuccessCallback,
  }: FetchInputEvent) => (
    from(axiosInstance.get(url, { params })).pipe(
      tap(({ data }) => { onSuccessCallback(data) }),
      catchError(() => {
        // todo implement error handling to support NETDATA.options.current.retries_on_data_failures
        onErrorCallback()
        return empty
      }),
    )
  ), CONCURRENT_CALLS_LIMIT),
)

output.subscribe()
