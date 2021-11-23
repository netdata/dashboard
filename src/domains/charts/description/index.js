import React, { useCallback } from "react"
import { Text } from "@netdata/netdata-ui"
import { useList } from "@/src/domains/charts/list"

const Description = ({ children, onClick, ...rest }) => {
  const list = useList()

  const click = useCallback(
    event => {
      const { hash = "" } = event.target

      if (hash.startsWith("#menu")) {
        event.preventDefault()
        list.goToLink(hash.substr(1))
      }

      if (onClick) onClick(event)
    },
    [list]
  )

  return children ? (
    <Text color="textDescription" dangerouslySetInnerHTML={{ __html: children }} onClick={click} {...rest} />
  ) : null
}

export default Description
