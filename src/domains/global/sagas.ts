import { uniq, prop, filter } from "ramda"
import {
  spawn, take, put, takeEvery, call, delay, select,
} from "redux-saga/effects"
import { channel } from "redux-saga"
import { AxiosResponse } from "axios"
import { Action } from "redux-act"

import { NETDATA_REGISTRY_SERVER } from "utils/utils"
import { axiosInstance } from "utils/api"
import { isDemo } from "utils/is-demo"
import { sidePanelTransitionTimeInSeconds } from "components/space-panel/settings"
import { fetchInfoAction } from "domains/chart/actions"

import {
  fetchHelloAction,
  FetchHelloPayload,
  windowFocusChangeAction,
  updatePersonUrlsAction,
  SetOptionAction,
  setOptionAction,
  setSpacePanelStatusAction,
  SetSpacePanelStatusActionPayload,
  setSpacePanelTransitionEndAction,
  HelloResponse,
  accessRegistrySuccessAction,
} from "./actions"
import { alarmsSagas } from "./alarms-sagas"
import { MASKED_DATA } from "./constants"
import { selectFullInfoPayload } from "./selectors"
import { InfoPayload } from "./__mocks__/info-mock"

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

const hasPosthogFeatureFlag = !!localStorage.getItem("posthog-dev")

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

function* waitForFullInfoPayload() {
  return (yield take(fetchInfoAction.success)).payload.fullInfoPayload
}

function* injectPosthog(machineGuid: string) {
  if (!(isDemo || hasPosthogFeatureFlag) || window.posthog) {
    return
  }
  const info: InfoPayload = (yield select(selectFullInfoPayload))
    || (yield call(waitForFullInfoPayload))
    || {}

  /* eslint-disable */
  // @ts-ignore
  !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
  /* eslint-enable */
  window.posthog.init("mqkwGT0JNFqO-zX2t0mW6Tec9yooaVu7xCBlXtHnt5Y", { api_host: "https://posthog.netdata.cloud" })
  window.posthog.register(
    // remove properties for with unavailable values
    filter((value) => value !== undefined && value !== null,
      {
        $ip: "127.0.0.1",
        $current_url: "agent dashboard",
        $pathname: "netdata-dashboard",
        $host: "dashboard.netdata.io",
        netdata_version: info.version,
        netdata_machine_guid: machineGuid,
        mirrored_host_count: info.mirrored_hosts?.length,
        alarms_normal: info.alarms?.normal,
        alarms_warning: info.alarms?.warning,
        alarms_critical: info.alarms.critical,
        host_os_name: info.os_name,
        host_os_id: info.os_id,
        host_os_id_like: info.os_id_like,
        host_os_version: info.os_version,
        host_os_version_id: info.os_version_id,
        host_os_detection: info.os_detection,
        system_cores_total: info.cores_total,
        system_total_disk_space: info.total_disk_space,
        system_cpu_freq: info.cpu_freq,
        system_ram_total: info.ram_total,
        system_kernel_name: info.kernel_name,
        system_kernel_version: info.kernel_version,
        system_architecture: info.architecture,
        system_vitrualization: info.virtualization,
        system_virt_detection: info.virt_detection,
        system_container: info.container,
        system_container_detection: info.container_detection,
        container_os_name: info.container_os_name,
        container_os_id: info.container_os_id,
        container_os_id_like: info.container_os_id_like,
        container_os_version: info.container_os_version,
        container_os_version_id: info.container_os_version_id,
        host_collectors_count: info.collectors.length,
        host_cloud_enabled: info["cloud-enabled"],
        host_cloud_available: info["cloud-available"],
        host_agent_claimed: info["agent-claimed"],
        host_aclk_available: info["aclk-available"],
        // eslint-disable-next-line camelcase
        host_is_parent: info.host_labels?._is_parent,
        mirrored_hosts_reachable: info.mirrored_hosts_status
          .filter(({ reachable }) => reachable).length,
        mirrored_hosts_unreachable: info.mirrored_hosts_status
          .filter(({ reachable }) => !reachable).length,
        host_collector_modules: info.collectors.map(prop("module")).join("|"),
        host_collector_plugins: info.collectors.map(prop("plugin")).join("|"),
        host_is_k8s_node: info.is_k8s_node,
      }),
  )
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
        guid: "",
        url: "",
        name: ""
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
  let response: AxiosResponse<HelloResponse>
  try {
    response = yield call(axiosInstance.get, helloCallUrl, {
      headers: {
        "Cache-Control": "no-cache, no-store",
        Pragma: "no-cache",
      },
      withCredentials: true,
    })
  } catch (error) {
    console.warn("error accessing registry or Do-Not-Track is enabled") // eslint-disable-line
    yield put(fetchHelloAction.failure())
    return
  }
  const cloudBaseURL = response.data.cloud_base_url
  const { hostname } = response.data
  const machineGuid = response.data.machine_guid
  const registryServer = response.data.registry
  const isUsingGlobalRegistry = registryServer === NETDATA_REGISTRY_SERVER

  yield put(fetchHelloAction.success({
    cloudBaseURL,
    hostname,
    isUsingGlobalRegistry,
    machineGuid,
  }))

  const name = isUsingGlobalRegistry ? MASKED_DATA : hostname
  const url = isUsingGlobalRegistry ? MASKED_DATA : serverDefault

  if (response.data.anonymous_statistics) {
    injectGTM(response.data.machine_guid)
    yield spawn(injectPosthog, response.data.machine_guid)
  }

  // now make access call - max_redirects, callback, etc...
  const accessRegistryResponse: AccessRegistryResponse = yield call(accessRegistry, {
    machineGuid,
    maxRedirects: 2,
    name,
    registryServer,
    url,
  })

  if (accessRegistryResponse?.urls && accessRegistryResponse?.personGuid) {
    const personUrls = parsePersonUrls(accessRegistryResponse.urls)
    const { registryMachines, registryMachinesArray } = personUrls
    yield put(updatePersonUrlsAction({
      personGuid: accessRegistryResponse.personGuid,
      registryMachines,
      registryMachinesArray,
    }))
  }

  yield put(accessRegistrySuccessAction({
    registryServer: accessRegistryResponse?.registryServer || registryServer,
  }))
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

function* spacePanelSaga({ payload }: Action<SetSpacePanelStatusActionPayload>) {
  if (payload.isActive) {
    document.body.className = "with-panel"
  } else {
    document.body.className = ""
  }
  yield delay(sidePanelTransitionTimeInSeconds * 1000)
  yield put(setSpacePanelTransitionEndAction({ isActive: payload.isActive }))
}

export function* globalSagas() {
  yield spawn(listenToWindowFocus)
  yield spawn(watchWindowFocusChannel)
  yield takeEvery(fetchHelloAction.request, fetchHelloSaga)
  yield spawn(alarmsSagas)
  yield takeEvery(setOptionAction, setOptonSaga)
  yield takeEvery(setSpacePanelStatusAction, spacePanelSaga)
}
