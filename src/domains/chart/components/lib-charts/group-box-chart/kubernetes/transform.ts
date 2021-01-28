/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable comma-dangle */
/* eslint-disable react/prop-types */
// @ts-nocheck

export default (chartData, filteredRows) => {
  const { keys, groupBy, postGroupBy, aggrGroups, postAggregated } = chartData
  const groupValues = keys[groupBy]
  const postGroupValues = keys[postGroupBy]
  const indexes = filteredRows || [...Array(groupValues.length)].map((v, index) => index)

  const postGroupData = indexes.reduce((acc: any, index: number) => {
    const groupValue = groupValues[index]
    if (!(groupValue in acc)) {
      acc[groupValue] = {
        labels: [],
        indexes: [],
        chartLabels: [],
        postAggregated: [],
      }
    }
    const boxes = acc[groupValue]
    boxes.indexes.push(index)
    boxes.labels.push(postGroupValues[index])
    boxes.postAggregated.push(postAggregated[index])

    const chartLabels = aggrGroups.reduce(
      (acc, label) => (keys[label][index] ? { ...acc, [label]: [keys[label][index]] } : acc),
      {}
    )
    boxes.chartLabels.push(chartLabels)
    return acc
  }, {})

  const labels = Object.keys(postGroupData).sort(
    (a, b) => postGroupData[b].indexes.length - postGroupData[a].indexes.length
  )

  const groupData = labels.map((label) => postGroupData[label])

  const groupChartLabels = groupData.map((boxes) => {
    return aggrGroups.reduce((acc, label) => {
      const groupLabels = new Set(
        boxes.chartLabels.reduce(
          (accChartLabels: any, chartLabels: any) =>
            chartLabels[label] ? [...accChartLabels, ...chartLabels[label]] : accChartLabels,
          []
        )
      )
      return groupLabels.size === 0 ? acc : { ...acc, [label]: Array.from(groupLabels) }
    }, {})
  })

  return { labels, data: groupData, chartLabels: groupChartLabels }
}
