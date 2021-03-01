export default (callback, times) => {
  return new Promise(resolve => {
    const innerRetry = remaining => {
      if (remaining === 0) return resolve()
      callback()
      requestAnimationFrame(() => innerRetry(--remaining))
    }

    innerRetry(times)
  })
}
