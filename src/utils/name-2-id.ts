export const name2id = (s: string) => s
  .replace(/ /g, "_")
  .replace(/:/g, "_")
  .replace(/\(/g, "_")
  .replace(/\)/g, "_")
  .replace(/\./g, "_")
  .replace(/\//g, "_")
