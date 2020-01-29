import {
  call,
  put,
  takeEvery,
  select,
  spawn,
  take,
} from "redux-saga/effects"
import { channel } from "redux-saga"
import { Action } from "redux-act"

import { axiosInstance } from "utils/api"
import { alwaysEndWithSlash } from "utils/server-detection"
import { fetchMetricsStream } from "utils/netdata-sdk"

import { selectGlobalPanAndZoom } from "domains/global/selectors"
import { StateT as GlobalStateT } from "domains/global/reducer"

import {
  fetchDataAction, FetchDataPayload,
  fetchChartAction, FetchChartPayload,
} from "./actions"

const fetchDataResponseChannel = channel()
export function* watchFetchDataResponseChannel() {
  while (true) {
    const action = (yield take(fetchDataResponseChannel))

    // special case - if requested relative timeRange, and during request the mode has been changed
    // to absolute global-pan-and-zoom, cancel the store update
    // todo do xss check of data
    if (action.type === fetchDataAction.success.toString()) {
      const { viewRange } = action.payload.fetchDataParams
      const globalPanAndZoom = (yield select(
        selectGlobalPanAndZoom,
      )) as GlobalStateT["globalPanAndZoom"]

      if (globalPanAndZoom
        && (viewRange[0] <= 0 || viewRange[1] <= 0)
      ) {
        // eslint-disable-next-line no-continue
        continue
      }
    }

    yield put(action)
  }
}


function fetchDataSaga({ payload }: Action<FetchDataPayload>) {
  const {
    // props for api
    host, chart, format, points, group, gtime, options, after, before, dimensions,
    // props for the store
    fetchDataParams, id,
  } = payload
  const url = `${alwaysEndWithSlash(host)}api/v1/data`

  const params = {
    chart,
    _: new Date().valueOf(),
    format,
    points,
    group,
    gtime,
    options,
    after,
    before,
    dimensions,
  }

  const onSuccessCallback = (data: unknown) => {
    fetchDataResponseChannel.put(fetchDataAction.success({
      chartData: data,
      fetchDataParams,
      id,
    }))
  }

  const onErrorCallback = () => {
    console.warn("fetch chart data failure") // eslint-disable-line no-console
    fetchDataResponseChannel.put(fetchDataAction.failure({ id }))
  }


  fetchMetricsStream.next({
    url,
    params,
    onErrorCallback,
    onSuccessCallback,
  })
}

function* fetchChartSaga({ payload }: Action<FetchChartPayload>) {
  const { chart, id, host } = payload
  let response
  const url = `${alwaysEndWithSlash(host)}api/v1/chart`
  try {
    response = yield call(axiosInstance.get, url, {
      params: {
        chart,
      },
    })
  } catch (e) {
    console.warn("fetch chart details failure") // eslint-disable-line no-console
    yield put(fetchChartAction.failure({ id }))
    return
  }
  yield put(fetchChartAction.success({
    chartDetails: response.data,
    id,
  }))
}

export function* chartSagas() {
  yield takeEvery(fetchDataAction.request, fetchDataSaga)
  yield takeEvery(fetchChartAction.request, fetchChartSaga)
  yield spawn(watchFetchDataResponseChannel)
}
