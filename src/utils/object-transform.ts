const camelToUnderscore = (key: string) => key.replace(/([A-Z])/g, "_$1").toLowerCase()

interface ObjectTransformatorOptions {
  func: (data: {}) => {}
  action: (data: {}, key: string, value: any) => {}
}

const underscoredKey = (target: {}, key: string, value: any) => ({
  ...target,
  [camelToUnderscore(key)]: value,
})

export const objectTransformator = (data: any, { func, action }: ObjectTransformatorOptions) => {
  if (Array.isArray(data)) {
    return data.map(func)
  }

  if (typeof data === "object" && data) {
    return Object.keys(data).reduce((d, key) => {
      const value = func(data[key])

      return action(d, key, value)
    }, {})
  }

  return data
}

export const underscoredKeys = (data: {}) => objectTransformator(data, {
  func: underscoredKeys,
  action: underscoredKey,
})
