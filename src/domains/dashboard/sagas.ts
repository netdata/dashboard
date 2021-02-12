/* eslint-disable camelcase */
/* eslint-disable operator-linebreak */
import { take, takeEvery } from "redux-saga/effects"
import { Action } from "redux-act"

import {
  clearHighlightAction,
  SetGlobalChartUnderlayAction,
  setGlobalChartUnderlayAction,
} from "domains/global/actions"
import {
  explicitlySignInAction,
  showSignInModalAction,
  ShowSignInModalAction,
} from "domains/dashboard/actions"
import { setHashParams, getHashParams, removeHashParams } from "utils/hash-utils"

export const LOCAL_STORAGE_NEEDS_SYNC = "LOCAL-STORAGE-NEEDS-SYNC"

function setGlobalChartUnderlaySaga({ payload }: Action<SetGlobalChartUnderlayAction>) {
  const { after, before } = payload
  if (window.urlOptions) {
    // additional check to prevent loop, after setting initial state from url
    if (window.urlOptions.after !== after || window.urlOptions.before !== before) {
      window.urlOptions.netdataHighlightCallback(true, after, before)
    }
  } else {
    // TODO: Consider a setting to control wether the component sets these hash params
    const hashParams = getHashParams()
    const highlight_after = Math.round(after).toString()
    const highlight_before = Math.round(before).toString()
    if (
      hashParams.highlight_after !== highlight_after ||
      hashParams.highlight_before !== highlight_before
    ) {
      setHashParams({ highlight_after, highlight_before })
    }
  }
}

function clearHighlightSaga() {
  if (window.urlOptions) {
    window.urlOptions.netdataHighlightCallback(false, 0, 0)
  } else {
    removeHashParams(["highlight_after", "highlight_before"])
  }
}

function* showSignInSaga({ payload }: Action<ShowSignInModalAction>) {
  if (window.showSignInModal) {
    window.showSignInModal()

    yield take(explicitlySignInAction)
    const { signInLinkHref } = payload
    window.localStorage.setItem(LOCAL_STORAGE_NEEDS_SYNC, "true")
    window.location.href = signInLinkHref
  }
}

export function* mainJsSagas() {
  yield takeEvery(setGlobalChartUnderlayAction, setGlobalChartUnderlaySaga)
  yield takeEvery(clearHighlightAction, clearHighlightSaga)
  yield takeEvery(showSignInModalAction, showSignInSaga)
}
