export type ReportEvent = (
  eventCategory?: string,
  eventAction?: string,
  eventLabel?: string,
  eventValue?: string
) => void
