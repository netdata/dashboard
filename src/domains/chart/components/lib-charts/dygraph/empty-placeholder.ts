import { useContext, useMemo } from "react"
import { ThemeContext } from "styled-components"

import { DygraphData } from "domains/chart/chart-types"
import { Attributes } from "domains/chart/utils/transformDataAttributes"

export const now = new Date().valueOf()

interface Args {
  attributes: Attributes
  chartData: DygraphData
  hasEmptyData: boolean
  orderedColors: string[]
  viewAfter: number
  viewBefore: number
}

export const useEmptyDataPlaceholder = (args: Args): Args => {
  const {
    attributes, chartData, hasEmptyData, viewAfter, viewBefore,
  } = args
  const themeContext = useContext(ThemeContext)

  return useMemo(() => {
    if (!hasEmptyData || (chartData.first_entry * 1000 <= viewBefore)) {
      return args
    }

    // paint chart manually
    const values = [1, 2, 3, 2, 1, 2.5, 1, 2.5, 4, 5.5, 3.5, 1.5]
    const pointDuration = (viewBefore - viewAfter) / (values.length - 1)
    const data = values.map((value, i) => ([
      viewAfter + i * pointDuration, value,
    ]))

    return {
      attributes: {
        ...attributes,
        dygraphValueRange: [0, 10],
        dygraphType: "stacked",
      },
      chartData: {
        ...chartData,
        result: {
          data,
          labels: [
            "time", "fake-dimension",
          ],
        },
      },
      hasEmptyData,
      orderedColors: [themeContext.colors.disabled],
      viewAfter,
      viewBefore,
    }
  }, [args, attributes, chartData, hasEmptyData, viewAfter, viewBefore])
}
