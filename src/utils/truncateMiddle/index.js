export default (text, maxLength) => {
  if (text.length <= maxLength) return text

  const spanLength = Math.floor((maxLength - 3) / 2)
  return `${text.substring(0, spanLength)}...${text.substring(text.length - spanLength)}`
}
