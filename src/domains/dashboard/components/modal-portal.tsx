import { ReactNode, useEffect, useRef } from "react"
import { createPortal } from "react-dom"

const modalRoot = document.getElementById("modal-root") as HTMLElement

type Props = {
  children: ReactNode
}
export const ModalPortal = ({ children }: Props) => {
  const element = useRef(document.createElement("div"))
  useEffect(() => {
    modalRoot.appendChild(element.current)
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      modalRoot.removeChild(element.current)
    }
  }, [])

  return createPortal(children, element.current)
}
