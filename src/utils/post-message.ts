import { useEffect, useCallback, useState } from "react"

type IframesMessageType =
  | "spaces"
  | "workspaces"
  | "hello-from-spaces-bar"
  | "hello-from-space-panel"
  | "hello-from-sign-in"
  | "is-signed-in"
  | "streamed-hosts-data"
  | "has-focus"
  | "iframe-focus-change"
  | "synced-private-registry"
  | "set-is-logout-dropdown-opened"
  | "user-node-access"
  | "request-refresh-access"

interface IframesMessage<T = unknown> {
  type: IframesMessageType
  payload: T
}

export const sendToChildIframe = (
  htmlIframeElement: HTMLIFrameElement | string,
  message: IframesMessage
) => {
  const iframeElement =
    typeof htmlIframeElement === "string"
      ? (document.getElementById(htmlIframeElement) as HTMLIFrameElement)
      : htmlIframeElement

  if (iframeElement.contentWindow) {
    iframeElement.contentWindow.postMessage(message, "*")
  }
}

export const useListenToPostMessage = <T>(
  messageType: IframesMessageType,
  callback?: (newMessage: T) => void,
  defaultState?: T | (() => T)
): [T | undefined, () => void] => {
  const [lastMessage, setLastMessage] = useState<T | undefined>(defaultState)
  const handleMessage = useCallback(
    message => {
      const data = message.data as IframesMessage<T>
      if (data.type === messageType) {
        setLastMessage(data.payload)
        if (callback) {
          callback(data.payload)
        }
      }
    },
    [callback, messageType]
  )
  const resetMesssage = useCallback(() => {
    setLastMessage(defaultState as T)
  }, [defaultState])
  useEffect(() => {
    window.addEventListener("message", handleMessage)
    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [handleMessage, messageType])
  return [lastMessage, resetMesssage]
}
