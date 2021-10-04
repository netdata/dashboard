import { useEffect, useState } from "react"

const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => getValueFromStorage(key, defaultValue))

  useEffect(() => localStorage.setItem(key, JSON.stringify(value)), [value])

  return [value, setValue]
}

const getValueFromStorage = (key, defaultValue = "") =>
  JSON.parse(localStorage.getItem(key)) ?? defaultValue

export default useLocalStorage
