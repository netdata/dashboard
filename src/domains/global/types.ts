/* eslint-disable camelcase */

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
  status: string
  old_status: string
  delay: number
  delay_up_to_timestamp: number
  updated_by_id: number
  updates_id: number
  value_string: string
  old_value_string: string
  last_repeat: string
  silenced: string
  info: string
  value: null
  old_value: null
}

export type AlarmLogs = AlarmLog[]

interface Alarms {
  [id: string]: {
    status: string
    value_string: string
  }
}

export interface ActiveAlarms {
  alarms: Alarms
  hostname: string
  latest_alarm_log_unique_id: number
  now: number
  status: boolean
}
