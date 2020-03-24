/* eslint-disable camelcase */

export interface ChartDataBase {
  after: number
  api: number
  before: number
  dimension_ids: string[]
  dimension_names: string[]
  dimensions: number
  first_entry: number
  format: string
  id: string
  last_entry: number
  latest_values: number[]
  max: number
  min: number
  name: string
  points: number

  update_every: number
  view_latest_values: number[]
  view_update_every: number
}

export interface DygraphData extends ChartDataBase{
  result: {
    data: (number[])[]
    labels: string[]
  }
}

export interface D3pieChartData extends ChartDataBase{
  result: {
    data: {[label: string]: number}[]
    labels: string[]
  }
}

export interface EasyPieChartData extends ChartDataBase{
  result: number[]
}

export type ChartData = DygraphData | EasyPieChartData | D3pieChartData

interface Dimension {
  name: string
}

export interface ChartMetadata {
  alarms: {}
  chart_type: string
  chart_variables: {
    [key: string]: number
  }
  context: string
  data_url: string
  dimensions: {
    [key: string]: Dimension
  }
  duration: number
  enabled: boolean
  family: string
  first_entry: number
  green: string | null
  id: string
  last_entry: number
  module?: string
  name: string
  plugin?: string
  priority: number
  red: string | null
  title: string
  type: string
  units: string
  update_every: number
  url: string
}

// type created temporarly during old main.js enrichChartData function
export interface ChartEnriched extends ChartMetadata {
  menu: string
  menu_pattern: string
  submenu: string
}

export interface ChartState {
  chartData: ChartData | null
  chartId: string | null
  chartMetadata: ChartMetadata | null
  chartPanAndZoom: null | {
    after: number
    before: number
    masterID?: string
    shouldForceTimeRange?: boolean
  }

  fetchDataParams: {
    isRemotelyControlled: boolean
    viewRange: [number, number]
  }
  isFetchingData: boolean
  isFetchDataFailure: boolean
  isFetchDetailsFailure: boolean
  isFetchingDetails: boolean

  snapshotDataIsFetching: boolean,
  snapshotDataIsError: boolean,
  snapshotData: ChartData | null,

  resizeHeight: number | null
}
