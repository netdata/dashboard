const MINUTE = -60
const DAY = -86400

export const timeSlices = [
  { text: "5m", timeGap: MINUTE * 5 },
  { text: "15m", timeGap: MINUTE * 15 },
  { text: "30m", timeGap: MINUTE * 30 },
  { text: "1h", timeGap: MINUTE * 60 },
  { text: "6h", timeGap: MINUTE * 60 * 6 },
  { text: "12h", timeGap: MINUTE * 60 * 12 },
  { text: "1d", timeGap: DAY },
  { text: "30d", timeGap: DAY * 30 },
]

export const REDUX_TIME_ALIAS = {
  min5: timeSlices[0],
  min15: timeSlices[1],
  min30: timeSlices[2],
  hour1: timeSlices[3],
  hour6: timeSlices[4],
  hour12: timeSlices[5],
  day1: timeSlices[6],
  day30: timeSlices[7],
}
