import { useHttp } from "hooks/use-http"
import { serverDefault } from "utils/server-detection"
import { ChartsMetadata } from "domains/global/types"

export const useChartsMetadata = () => {
  const [chartsMetadata] = useHttp<ChartsMetadata>(`${serverDefault}api/v1/charts`)
  return chartsMetadata
}
