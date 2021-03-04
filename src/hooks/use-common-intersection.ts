import {
  useEffect, useRef, useState, MutableRefObject,
} from "react"

const globalIntersectionOptions = {
  root: null,
  rootMargin: "0px",
  threshold: undefined,
}

type IntersectionCallback = (isVisible: boolean) => void
type Listener = {
  element: HTMLElement,
  callback: IntersectionCallback,
}
const createGlobalIntersectionObserver = () => {
  let listeners: Listener[] = []
  const globalHandler = (entries: IntersectionObserverEntry[]) => {
    entries.forEach(({ isIntersecting, target }) => {
      const callback = listeners.find(({ element }) => element === target)?.callback
      if (callback) {
        callback(isIntersecting)
      }
    })
  }
  const globalObserver = new IntersectionObserver(globalHandler, globalIntersectionOptions)

  return {
    subscribe: (element: HTMLElement, callback: IntersectionCallback) => {
      globalObserver.observe(element)
      listeners = listeners.concat({ element, callback })
    },
    unsubscribe: (elementToUnsubscribe: HTMLElement) => {
      listeners = listeners.filter(({ element }) => element !== elementToUnsubscribe)
    },
  }
}
const globalIntersectionObserver = createGlobalIntersectionObserver()


// this hook is created for 2 reasons:
// 1) to use the same IntersectionObserver for all charts (contrary to use-intersection from
//    react-use, which creates new observer for every hook)
// 2) to update the isVisible state only when necessary (contrary to what "use-in-view" hook from
//    https://github.com/thebuilder/react-intersection-observer does)
export const useCommonIntersection = (
  element: HTMLElement,
  clonedChildrenRef: MutableRefObject<HTMLElement | undefined>,
) => {
  const [isVisible, setIsVisible] = useState(false)
  const isVisibleRef = useRef(isVisible)
  // the ref is just to prevent most updates on init - charts are not visible on first intersection
  // observer callback, but it still tries to set the state. UseState does not bail out when
  // state doesn't change

  useEffect(() => {
    if (typeof IntersectionObserver === "function") {
      globalIntersectionObserver.subscribe(
        element,
        (newIsVisible) => {
          if (isVisibleRef.current !== newIsVisible) {
            if (clonedChildrenRef.current) {
              // eslint-disable-next-line no-param-reassign
              clonedChildrenRef.current.style.visibility = newIsVisible ? "visible" : "hidden"
            }

            isVisibleRef.current = newIsVisible
            // we need to mirror it in `use-state` to cause react update
            setIsVisible(newIsVisible)
          }
        },
      )
    }
    return () => {
      globalIntersectionObserver.unsubscribe(element)
    }
  }, [clonedChildrenRef, element])

  return isVisible
}
