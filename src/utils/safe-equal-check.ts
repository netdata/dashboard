export const safeEqualCheck = (a: unknown, b: unknown) => {
  if (a === b) {
    return true
  }
  return Number.isNaN(a as number) && Number.isNaN(b as number)
}
