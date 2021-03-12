import { useMount } from "react-use"

import { useDispatch } from "store/redux-separate-context"
import { getHashParams } from "utils/hash-utils"
import { setAlarmAction, setGlobalPanAndZoomAction } from "domains/global/actions"

export default () => {
  const dispatch = useDispatch()
  useMount(() => {
    const params = getHashParams()
    const alarmWhen = params["alarm_when"]
    if (alarmWhen) {
      const alarmTime = Number(alarmWhen)

      const alarmStatus = params["alarm_status"]
      const alarmChart = params["alarm_chart"]
      const alarmValue = params["alarm_value"]

      dispatch(setAlarmAction({
        alarm: {
          chart: alarmChart,
          // @ts-ignore
          status: alarmStatus,
          value: alarmValue,
          when: alarmTime,
        },
      }))
      const PADDING = 1000 * 60 * 5
      dispatch(setGlobalPanAndZoomAction({
        after: alarmTime * 1000 - PADDING,
        before: alarmTime * 1000 + PADDING,
      }))
    }
  })
}
