import { ReactNode, useEffect, useRef } from "react"
import { createPortal } from "react-dom"

const datePickerRoot = document.getElementById("date-picker-root") as HTMLElement

type Props = {
  children: ReactNode
}

export const DatePickerPortal = ({
  children,
}: Props) => {
  const element = useRef(document.createElement("div"))
  useEffect(() => {
    datePickerRoot.appendChild(element.current)
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      datePickerRoot.removeChild(element.current)
    }
  }, [])

  return createPortal(children, element.current)
}
