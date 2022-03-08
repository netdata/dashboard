/* eslint-disable camelcase */

import { ChartMetadata } from "domains/chart/chart-types"
import {
  UserStatus,
  NodeClaimedStatus,
  UserNodeAccess,
  NodeLiveness,
} from "domains/dashboard/components/migration-modal"

export type AlarmStatus =
  | "WARNING"
  | "ERROR"
  | "REMOVED"
  | "UNDEFINED"
  | "UNINITIALIZED"
  | "CLEAR"
  | "CRITICAL"
// it's possible that this interface is too narrow
export interface AlarmLog {
  hostname: string
  unique_id: number
  alarm_id: number
  alarm_event_id: number
  name: string
  chart: string
  family: string
  processed: true
  updated: false
  exec_run: number
  exec_failed: false
  exec: string
  recipient: string
  exec_code: number
  source: string
  units: string
  when: number
  duration: number
  no_clear_notification?: boolean
  non_clear_duration: number
  status: AlarmStatus
  old_status: AlarmStatus
  delay: number
  delay_up_to_timestamp: number
  updated_by_id: number
  updates_id: number
  value_string: string
  old_value_string: string
  last_repeat: string
  silenced: string
  info: string
  value: number
  old_value: number
}

export type AlarmLogs = AlarmLog[]

export type Alarm = {
  chartId: string
  value: string
  status: AlarmStatus
  when: number
}

interface Alarms {
  [id: string]: {
    status: "CRITICAL" | "WARNING"
    value_string: string
  }
}

export interface ChartsMetadata {
  alarms_count: number
  charts: {
    [chartName: string]: ChartMetadata
  }
  charts_count: number
  custom_info: string
  dimensions_count: number
  history: number
  hostname: string
  hosts: { hostname: string }[]
  hosts_count: number
  labels?: {
    _is_master: string
    _container: string
    _virtualization: string
    _architecture: string
    _kernel_version: string
    _os_version: string
    _os_name: string
  }
  memory_mode: string
  os: string
  release_channel: string
  rrd_memory_bytes: number
  timezone: string
  update_every: number
  version: string
}

export interface ActiveAlarms {
  alarms: Alarms
  hostname: string
  latest_alarm_log_unique_id: number
  now: number
  status: boolean
}

export interface Snapshot {
  after_ms: number
  before_ms: number
  duration_ms: number

  highlight_after_ms: number
  highlight_before_ms: number
  update_every_ms: number

  charts: ChartsMetadata
  comments: string
  data: { [chartUniqueId: string]: unknown }
  data_points: number
  hash: string
  hostname: string
  server: string
  netdata_version: string
  snapshot_version: number
  url: string
}

export type UserNodeAccessMessage = {
  userStatus: UserStatus
  nodeClaimedStatus: NodeClaimedStatus
  nodeLiveness: NodeLiveness
  userNodeAccess: UserNodeAccess
}
