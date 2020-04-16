import { uniq } from "ramda"
import {
  spawn, take, put, takeEvery, call,
} from "redux-saga/effects"
import { channel } from "redux-saga"
import { AxiosResponse } from "axios"
import { Action } from "redux-act"

import { NETDATA_REGISTRY_SERVER } from "utils"
import { axiosInstance } from "utils/api"

import {
  fetchHelloAction,
  FetchHelloPayload,
  windowFocusChangeAction,
  updatePersonUrlsAction,
  SetOptionAction,
  setOptionAction,
  setSpacePanelStatusAction,
  SetSpacePanelStatusActionPayload,
} from "./actions"
import { alarmsSagas } from "./alarms-sagas"
import { MASKED_DATA } from "./constants"

const windowFocusChannel = channel()

export function listenToWindowFocus() {
  window.addEventListener("focus", () => {
    windowFocusChannel.put(windowFocusChangeAction({ hasWindowFocus: true }))
  })
  window.addEventListener("blur", () => {
    windowFocusChannel.put(windowFocusChangeAction({ hasWindowFocus: false }))
  })
}

export function* watchWindowFocusChannel() {
  while (true) {
    const action = yield take(windowFocusChannel)
    yield put(action)
  }
}

/* eslint-disable camelcase */
interface HelloResponse {
  action: "hello"
  anonymous_statistics: boolean
  cloud_base_url: string
  hostname: string
  machine_guid: string
  registry: string
  status: string
}
/* eslint-enable camelcase */

const injectGTM = (machineGuid: string) => {
  // @ts-ignore
  if (document.querySelector("script[src^=\"https://www.googletagmanager.com/gtm.js\"]")) {
    // make sure gtm is loaded only once
    return
  }
  /* eslint-disable */
  // @ts-ignore
  ; (function (w, d, s, l, i) {
    // @ts-ignore
    w[l] = w[l] || []
    // @ts-ignore
    w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" })
    var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s),
      // @ts-ignore
      dl = l != "dataLayer" ? "&l=" + l : ""
    // @ts-ignore
    j.async = false

    // @ts-ignore
    j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl
    // @ts-ignore
    f.parentNode.insertBefore(j, f)
  })(window, document, "script", "dataLayer", "GTM-N6CBMJD")
  // @ts-ignore
  dataLayer.push({ anonymous_statistics: "true", machine_guid: machineGuid })
  /* eslint-enable */
}

export type PersonUrl = [
  string, // guid
  string, // url
  number, // last timestamp (ms)
  number, // accesses
  string // name
]

type AccessRegistryResponse = null | {
  personGuid?: string
  registryServer: string
  urls?: PersonUrl[]
}

type AccessRegistry = (args: {
  machineGuid: string
  maxRedirects: number
  name: string
  registryServer: string
  url: string
}) => Promise<AccessRegistryResponse>
const accessRegistry: AccessRegistry = ({
  machineGuid, maxRedirects, name, registryServer, url,
}) => axiosInstance.get(`${registryServer}/api/v1/registry`, {
  headers: {
    "Cache-Control": "no-cache, no-store",
    Pragma: "no-cache",
  },
  params: {
    action: "access",
    machine: machineGuid,
    name,
    url,
  },
  withCredentials: true, // required for the cookie
}).then(({ data }) => {
  // todo xss check
  const isRedirect = typeof data.registry === "string"

  let returnData = data
  if (typeof data.status !== "string" || data.status !== "ok") {
    // todo throw error (409 in old dashboard)
    returnData = null
  }

  if (returnData === null) {
    if (isRedirect && maxRedirects > 0) {
      return accessRegistry({
        maxRedirects: maxRedirects - 1,
        machineGuid,
        name,
        registryServer: data.registry,
        url,
      })
    }
    return { registryServer }
  }
  const urls = data.urls.filter((u: [string, string]) => u[1] !== MASKED_DATA)
  return {
    personGuid: data.person_guid || null,
    registryServer,
    urls,
  }
}).catch(() => {
  // todo handle error in better way (410 in old dashboard)
  console.warn("error calling registry:", registryServer) // eslint-disable-line no-console
  return null
})

export interface RegistryMachine {
  guid: string
  url: string
  lastTimestamp: number
  accesses: number
  name: string
  alternateUrls: string[]
}

type ParsePersonUrls = (
  personUrls: PersonUrl[]
) => {
  registryMachines: { [key: string]: RegistryMachine }
  registryMachinesArray: RegistryMachine[]
}
export const parsePersonUrls: ParsePersonUrls = (personUrls) => {
  // todo main.js is using registryMachines, but should use only the array
  const registryMachines: { [key: string]: RegistryMachine } = {}

  personUrls
    .slice()
    .reverse()
    .forEach(([guid, url, lastTimestamp, accesses, name]: PersonUrl) => {
      const existingObj = registryMachines[guid] || {
        lastTimestamp: 0,
        accesses: 0,
        alternateUrls: [],
      }
      const isNewer = existingObj.lastTimestamp < lastTimestamp
      const extended: RegistryMachine = {
        guid: existingObj.guid || guid,
        url: isNewer ? url : existingObj.url,
        lastTimestamp: isNewer ? lastTimestamp : existingObj.lastTimestamp,
        accesses: existingObj.accesses + accesses,
        name: isNewer ? name : existingObj.name,
        alternateUrls: existingObj.alternateUrls.concat(url),
      }
      registryMachines[guid] = extended
    })

  const registryMachinesArray = uniq(
    // not sure if reverse is needed, but it was in old dashboard
    personUrls
      .slice()
      .reverse()
      .map(([guid]: PersonUrl) => guid),
  ).map((guid) => registryMachines[guid])
  return {
    registryMachines,
    registryMachinesArray,
  }
}

function* fetchHelloSaga({ payload }: Action<FetchHelloPayload>) {
  const { serverDefault } = payload
  const helloCallUrl = `${serverDefault}api/v1/registry?action=hello`
  const response: AxiosResponse<HelloResponse> = yield call(axiosInstance.get, helloCallUrl, {
    headers: {
      "Cache-Control": "no-cache, no-store",
      Pragma: "no-cache",
    },
    withCredentials: true,
  })
  // todo xss

  const registryServer = response.data.registry

  const cloudBaseURL = response.data.cloud_base_url

  const machineGuid = response.data.machine_guid
  const { hostname } = response.data

  const isUsingGlobalRegistry = registryServer === NETDATA_REGISTRY_SERVER

  const name = isUsingGlobalRegistry ? MASKED_DATA : hostname
  const url = isUsingGlobalRegistry ? MASKED_DATA : serverDefault

  if (response.data.anonymous_statistics) {
    injectGTM(response.data.machine_guid)
  }

  // now make access call - max_redirects, callback, etc...
  const accessRegistryResponse: AccessRegistryResponse = yield call(accessRegistry, {
    machineGuid,
    maxRedirects: 2,
    name,
    registryServer,
    url,
  })

  yield put(fetchHelloAction.success({
    cloudBaseURL,
    hostname,
    isUsingGlobalRegistry,
    machineGuid,
    registryServer: accessRegistryResponse?.registryServer || registryServer,
  }))

  if (accessRegistryResponse?.urls && accessRegistryResponse?.personGuid) {
    const personUrls = parsePersonUrls(accessRegistryResponse.urls)
    const { registryMachines, registryMachinesArray } = personUrls
    yield put(updatePersonUrlsAction({
      personGuid: accessRegistryResponse.personGuid,
      registryMachines,
      registryMachinesArray,
    }))
    window.netdataRegistryCallback(registryMachinesArray)
  } else {
    window.netdataRegistryCallback()
  }
}

const constructOptionStorageKey = (key: string) => `options.${key}`
function setOptonSaga({ payload }: Action<SetOptionAction>) {
  const { key, value } = payload
  if (key === "stop_updates_when_focus_is_lost") {
    // old dashboard was saving that property to localStorage, but was always ommiting it when
    // reading. it was only possible to persist this setting via url (update_always hash param)
    return
  }
  localStorage.setItem(constructOptionStorageKey(key), JSON.stringify(value))
}

function spacePanelSaga({ payload }: Action<SetSpacePanelStatusActionPayload>) {
  if (payload.isActive) {
    document.body.className = "with-panel"
  } else {
    document.body.className = ""
  }
}

export function* globalSagas() {
  yield spawn(listenToWindowFocus)
  yield spawn(watchWindowFocusChannel)
  yield takeEvery(fetchHelloAction.request, fetchHelloSaga)
  yield spawn(alarmsSagas)
  yield takeEvery(setOptionAction, setOptonSaga)
  yield takeEvery(setSpacePanelStatusAction, spacePanelSaga)
}
