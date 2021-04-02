import React, { Fragment, useCallback } from "react"
import { useToggle } from "react-use"
import { Layer, Flex } from "@netdata/netdata-ui"
import Header from "./header"
import Item from "./item"
import { Container } from "./container"

const News = ({ children, items = [], onCloseClick }) => {
  const [isOpen, toggle] = useToggle()

  const onClose = useCallback(() => {
    toggle()
    if (onCloseClick) onCloseClick()
  }, [toggle, onCloseClick])

  return (
    <Fragment>
      {children(toggle, isOpen)}
      {isOpen && (
        <Layer backdrop onClickOutside={onClose} onEsc={onClose}>
          <Flex
            background="mainBackground"
            round
            padding={[6]}
            width="640px"
            height={{ max: "640px" }}
            gap={4}
            column
          >
            <Header onClose={onClose} />
            <Container column gap={6}>
              {items.map(item => (
                <Item key={item.id} item={item} />
              ))}
            </Container>
          </Flex>
        </Layer>
      )}
    </Fragment>
  )
}

export default News
