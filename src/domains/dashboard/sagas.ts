import { takeEvery } from "redux-saga/effects"
import { Action } from "redux-act"

import {
  clearHighlightAction,
  resetGlobalPanAndZoomAction,
  SetGlobalChartUnderlayAction,
  setGlobalChartUnderlayAction,
  SetGlobalPanAndZoomAction,
  setGlobalPanAndZoomAction,
} from "domains/global/actions"

function setGlobalPanAndZoomSaga({ payload }: Action<SetGlobalPanAndZoomAction>) {
  if (window.urlOptions) {
    const { after, before } = payload
    // additional check to prevent loop, after setting initial state from url
    if (window.urlOptions.after !== after || window.urlOptions.before !== before) {
      window.urlOptions.netdataPanAndZoomCallback(true, after, before)
    }
  }
}

function resetGlobalPanAndZoomSaga() {
  if (window.urlOptions) {
    window.urlOptions.netdataPanAndZoomCallback(false, 0, 0)
  }
}

function setGlobalChartUnderlaySaga({ payload }: Action<SetGlobalChartUnderlayAction>) {
  if (window.urlOptions) {
    const { after, before } = payload
    // additional check to prevent loop, after setting initial state from url
    if (window.urlOptions.after !== after || window.urlOptions.before !== before) {
      window.urlOptions.netdataHighlightCallback(true, after, before)
    }
  }
}


function clearHighlightSaga() {
  if (window.urlOptions) {
    window.urlOptions.netdataHighlightCallback(false, 0, 0)
  }
}

export function* mainJsSagas() {
  yield takeEvery(setGlobalPanAndZoomAction, setGlobalPanAndZoomSaga)
  yield takeEvery(resetGlobalPanAndZoomAction, resetGlobalPanAndZoomSaga)
  yield takeEvery(setGlobalChartUnderlayAction, setGlobalChartUnderlaySaga)
  yield takeEvery(clearHighlightAction, clearHighlightSaga)
}
