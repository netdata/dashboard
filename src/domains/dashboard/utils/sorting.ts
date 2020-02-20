// some old functions here, i don't have time to comprehend them now

// --------------------------------------------------------------------
// natural sorting
// http://www.davekoelle.com/files/alphanum.js - LGPL

const naturalSortChunkify = (t: string) => {
  const tz = []
  let x = 0
  let y = -1; let n = 0 as boolean | number; let i; let j

  // eslint-disable-next-line no-cond-assign,no-plusplus
  while (i = (j = t.charAt(x++)).charCodeAt(0)) {
    const m = (i >= 48 && i <= 57)
    if (m !== n) {
      // eslint-disable-next-line no-plusplus
      tz[++y] = ""
      n = m
    }
    tz[y] += j
  }

  return tz
}


export const naturalSortCompare = (a: string, b: string) => {
  const aa = naturalSortChunkify(a.toLowerCase())
  const bb = naturalSortChunkify(b.toLowerCase())

  // eslint-disable-next-line no-plusplus
  for (let x = 0; aa[x] && bb[x]; x++) {
    if (aa[x] !== bb[x]) {
      const c = Number(aa[x]); const
        d = Number(bb[x])
      if (c.toString() === aa[x] && d.toString() === bb[x]) {
        return c - d
      }
      return (aa[x] > bb[x]) ? 1 : -1
    }
  }
  return aa.length - bb.length
}


interface ObjectsWithPriority {
  [key: string]: {
    priority: number
  }
}
export const sortObjectByPriority = <T extends ObjectsWithPriority>(object: T) => {
  const sorted = Object.keys(object)

  sorted.sort((a, b) => {
    if (object[a].priority < object[b].priority) {
      return -1
    }
    if (object[a].priority > object[b].priority) {
      return 1
    }
    return naturalSortCompare(a, b)
  })

  return sorted
}


interface PrioritySortObject {
  name: string
  priority: number
}
export const prioritySort = <T extends PrioritySortObject>(a: T, b: T) => {
  if (a.priority < b.priority) {
    return -1
  }
  if (a.priority > b.priority) {
    return 1
  }
  return naturalSortCompare(a.name, b.name)
}
