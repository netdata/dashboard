import React, { useState, useEffect } from "react"
import Item from "./item"
import Pill from "./pill"

const useOnline = () => {
  const [isOnline, setOnline] = useState(true)

  useEffect(() => {
    const onOnline = () => setOnline(true)
    const onOffline = () => setOnline(false)

    window.addEventListener("online", onOnline, { passive: true })
    window.addEventListener("offline", onOffline, { passive: true })
    return () => {
      window.removeEventListener("online", onOnline)
      window.removeEventListener("offline", onOffline)
    }
  }, [])

  return isOnline
}

const Status = () => {
  const isOnline = useOnline()
  return (
    <Item>
      <Pill background="border" color="bright">
        {isOnline ? "ONLINE" : "OFFLINE"}
      </Pill>
    </Item>
  )
}

export default Status
