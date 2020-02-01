import React from "react"

import { Attributes } from "domains/chart/utils/transformDataAttributes"
import {useSelector} from "store/redux-separate-context"
import {selectIsSnapshotMode} from "domains/dashboard/selectors"

interface SnapshotLoaderProps {
  attributes: Attributes
  chartUuid: string
}
const SnapshotLoader = ({
  attributes,
  chartUuid,
}: SnapshotLoaderProps) => {
  return null
}


interface SnapshotLoaderContainerProps {
  attributes: Attributes
  chartUuid: string
}
export const SnapshotLoaderContainer = ({
  attributes,
  chartUuid,
}: SnapshotLoaderContainerProps) => {
  const isFetchingSnapshots = useSelector(selectIsSnapshotMode)
  if (!isFetchingSnapshots) {
    return null
  }
  return <SnapshotLoader attributes={attributes} chartUuid={chartUuid} />
}
