import {
  call, delay, spawn, take,
} from "redux-saga/effects"

import { startAlarmsAction, StartAlarmsPayload } from "domains/global/actions"
import { axiosInstance } from "utils/api"

const ALARMS_INITIALIZATION_DELAY = 1000
const ALARMS_UPDATE_EVERY = 10000 // the time in ms between alarm checks

// equal to old NETDATA.alarms.notifications
const areNotificationsAvailable = "Notification" in window

const requestPermissions = () => {
  if (areNotificationsAvailable) {
    if (Notification.permission === "default") {
      Notification.requestPermission()
    }
  }
}

const hasGivenNotificationPermissions = () => (areNotificationsAvailable
  && Notification.permission === "granted"
)


const notifyAll = () => {
}

// todo this doesnt change in the session, but should be moved to the state anyway
let firstNotificationId = 0
let lastNotificationId = 0

function* get(what: string, serverDefault: string) {
  const { data } = yield call(axiosInstance.get, `${serverDefault}/api/v1/alarms?${what}`)
  if (firstNotificationId === 0 && typeof data.latest_alarm_log_unique_id === "number") {
    firstNotificationId = data.latest_alarm_log_unique_id
  }
  // todo add error handling
  return data
}

function* alarmsLoop(serverDefault: string) {
  while (true) {
    const data = yield call(get, "active", serverDefault)
    // todo xss check
    yield delay(ALARMS_UPDATE_EVERY)
    if (data) {
      if (
        hasGivenNotificationPermissions()
        && (data.latest_alarm_log_unique_id > lastNotificationId)
      ) {
        notifyAll()

        if (data.status === false) {
          // Health monitoring is disabled on this netdata
          break
        }
      }
    }
  }
}

function* startAlarms() {
  // make sure we handle that action only once, we don't want multiple intervals/loops
  const { payload }: { payload: StartAlarmsPayload } = yield take(startAlarmsAction)
  const { serverDefault } = payload

  yield delay(ALARMS_INITIALIZATION_DELAY)

  // todo use localstorage service
  lastNotificationId = +(localStorage.getItem("last_notification_id") || lastNotificationId)
  requestPermissions()
  yield call(alarmsLoop, serverDefault)
}

export function* alarmsSagas() {
  yield spawn(startAlarms)
}
