import { sortBy, prop, last } from "ramda"
import { Action } from "redux-act"
import {
  call, delay, spawn, take, takeEvery, put,
} from "redux-saga/effects"

import { axiosInstance } from "utils/api"
import { serverStatic } from "utils/server-detection"
import { name2id } from "utils/name-2-id"

import {
  startAlarmsAction, StartAlarmsPayload, fetchAllAlarmsAction, updateActiveAlarmsAction,
} from "./actions"
import { AlarmLogs, AlarmLog, ActiveAlarms } from "./types"

const ALARMS_INITIALIZATION_DELAY = 1000
const ALARMS_UPDATE_EVERY = 10000 // the time in ms between alarm checks
const CHART_DIV_OFFSET = -50

// firefox moves the alarms off-screen (above, outside the top of the screen)
// if alarms are shown faster than: one per 500ms
const ALARMS_MS_BETWEEN_NOTIFICATIONS = 500

// equal to old NETDATA.alarms.notifications
const areNotificationsAvailable = "Notification" in window

const notificationCallback = window.netdataAlarmsNotifCallback


// todo this doesnt change in the session, but should be moved to the redux state anyway
let firstNotificationId = 0
let lastNotificationId = 0


const scrollToChart = (chartID: unknown): boolean => {
  if (typeof chartID === "string") {
    const chartElement = document.querySelector(`#chart_${name2id(chartID)}`)
    if (chartElement) {
      const offset = (chartElement as HTMLDivElement).offsetTop + CHART_DIV_OFFSET;
      (document.querySelector("html") as HTMLElement).scrollTop = offset
      return true
    }
  }
  return false
}

// perhaps sagas are not the best place for this
const scrollToAlarm = (alarm: AlarmLog) => {
  if (typeof alarm === "object") {
    const hasFoundChart = scrollToChart(alarm.chart)
    if (hasFoundChart) {
      window.focus()
    }
  }
}

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

function* getLog(lastNotificationIdArg: number, serverDefault: string) {
  try {
    const { data } = yield call(
      axiosInstance.get,
      `${serverDefault}/api/v1/alarm_log?after=${lastNotificationIdArg}`,
    )
    // todo xss check
    return data
  } catch (error) {
    console.warn("Error fetching alarms log", error) // eslint-disable-line no-console
    return null
  }
}

interface NotificationConfig {
  notificationTitle: string
  notificationOptions: NotificationOptions
  notificationHandler: (event: Event) => void
}
// called "notify" in old codebase
const getNotification = (
  entry: AlarmLog, activeAlarms: ActiveAlarms, firstNotificationIdArg: number,
): NotificationConfig | undefined => {
  if (entry.updated) {
    // has been updated by another alarm
    return
  }

  let valueString = entry.value_string
  const t = activeAlarms.alarms[`${entry.chart}.${entry.name}`]
  if (typeof t !== "undefined"
    && entry.status === t.status
    && typeof t.value_string !== "undefined"
  ) {
    valueString = t.value_string
  }

  const name = entry.name.replace(/_/g, " ")
  let status = entry.status.toLowerCase()
  let title = `${name} = ${valueString}`
  const tag = entry.alarm_id
  let icon = "images/banner-icon-144x144.png"
  let interaction = false
  let show = true

  // switch/case left here to simplify refractor (it's very similar to old code)
  switch (entry.status) {
    case "REMOVED":
      show = false
      break

    case "UNDEFINED":
      return

    case "UNINITIALIZED":
      return

    case "CLEAR":
      if (entry.unique_id < firstNotificationIdArg) {
        // alarm is not current
        return
      }
      if (entry.old_status === "UNINITIALIZED" || entry.old_status === "UNDEFINED") {
        // alarm switch to CLEAR from old_status
        return
      }
      if (entry.no_clear_notification) {
        // alarm is CLEAR but has no_clear_notification flag
        return
      }
      title = `${name} back to normal (${valueString})`
      icon = "images/check-mark-2-128-green.png"
      interaction = false
      break

    case "WARNING":
      if (entry.old_status === "CRITICAL") {
        status = `demoted to ${entry.status.toLowerCase()}`
      }

      icon = "images/alert-128-orange.png"
      interaction = false
      break

    case "CRITICAL":
      if (entry.old_status === "WARNING") {
        status = `escalated to ${entry.status.toLowerCase()}`
      }

      icon = "images/alert-128-red.png"
      interaction = true
      break

    default:
      console.warn(`invalid alarm status ${entry.status}`) // eslint-disable-line no-console
      return
  }

  // filter recipients
  // if (show) {
  //   show = NETDATA.alarms.recipientMatches(entry.recipient, NETDATA.alarms.recipients)
  // }


  if (show) {
    if (typeof notificationCallback === "function") {
      show = notificationCallback(entry)
    }

    if (show) {
      // show this notification
      // eslint-disable-next-line consistent-return
      return {
        notificationTitle: title,
        notificationOptions: {
          body: `${entry.hostname} - ${entry.chart} (${entry.family}) - ${status}: ${entry.info}`,
          tag: `${tag}`,
          requireInteraction: interaction,
          icon: serverStatic + icon,
          data: entry,
        },
        notificationHandler: (event: Event) => {
          event.preventDefault()
          if (event.target) {
            const { data } = event.target as Notification
            scrollToAlarm(data)
          }
        },
      }
    }
  }
}

function* notifyAll(serverDefault: string, activeAlarms: ActiveAlarms) {
  const alarmLogs: AlarmLogs = yield call(getLog, lastNotificationId, serverDefault)
  if (alarmLogs === null || typeof alarmLogs !== "object") {
    console.warn("invalid alarms log response") // eslint-disable-line no-console
    return
  }

  if (alarmLogs.length === 0) {
    console.log("received empty alarm log") // eslint-disable-line no-console
    return
  }

  const logsSorted = sortBy(prop("unique_id"), alarmLogs)

  // eslint-disable-next-line camelcase
  const newLogs = logsSorted.filter(({ unique_id }) => unique_id > lastNotificationId)
  const notifications = newLogs
    .map((entry) => (getNotification(entry, activeAlarms, firstNotificationId)))
    .filter((x) => x !== undefined) as NotificationConfig[]

  for (let i = 0; i < notifications.length; i += 1) {
    const {
      notificationTitle, notificationOptions, notificationHandler,
    } = notifications[i]
    const notification = new Notification(
      notificationTitle,
      notificationOptions,
    )
    notification.onclick = notificationHandler

    yield delay(ALARMS_MS_BETWEEN_NOTIFICATIONS)
  }

  // todo put to redux store
  lastNotificationId = (last(logsSorted) as AlarmLog).unique_id

  if (typeof window.netdataAlarmsRemember === "undefined" || window.netdataAlarmsRemember) {
    localStorage.setItem("last_notification_id", `${lastNotificationId}`)
  }
}


function* get(what: string, serverDefault: string) {
  const { data } = yield call(axiosInstance.get, `${serverDefault}/api/v1/alarms?${what}`)
  if (firstNotificationId === 0 && typeof data.latest_alarm_log_unique_id === "number") {
    firstNotificationId = data.latest_alarm_log_unique_id
  }
  return data
}

function* alarmsLoop(serverDefault: string) {
  while (true) {
    const activeAlarms = (yield call(get, "active", serverDefault)) as ActiveAlarms
    if (activeAlarms) {
      if (window.alarmsCallback) {
        // connect to old main.js (update old header)
        window.alarmsCallback(activeAlarms)
      }
      yield put(updateActiveAlarmsAction({ activeAlarms }))
      if (
        hasGivenNotificationPermissions()
        // timestamps in seconds
        && (activeAlarms.latest_alarm_log_unique_id > lastNotificationId)
      ) {
        yield call(notifyAll, serverDefault, activeAlarms)

        if (activeAlarms.status === false) {
          // Health monitoring is disabled on this netdata
          break
        }
      }
    }
    yield delay(ALARMS_UPDATE_EVERY)
  }
}

function* startAlarms() {
  // make sure we handle that action only once, we don't want multiple intervals/loops
  const { payload }: { payload: StartAlarmsPayload } = yield take(startAlarmsAction)
  const { serverDefault } = payload

  yield delay(ALARMS_INITIALIZATION_DELAY)

  lastNotificationId = +(localStorage.getItem("last_notification_id") || lastNotificationId)
  requestPermissions()
  yield call(alarmsLoop, serverDefault)
}

type FetchAllAlarmsPayload = {
  callback: (x: unknown) => void,
  serverDefault: string,
}
function* fetchAllAlarmsSaga({ payload }: Action<FetchAllAlarmsPayload>) {
  const { callback, serverDefault } = payload
  const allAlarms = yield call(get, "all", serverDefault)
  callback(allAlarms)
}

export function* alarmsSagas() {
  yield spawn(startAlarms)
  yield takeEvery(fetchAllAlarmsAction.request, fetchAllAlarmsSaga)
}
