import React from "react"
import styled from "styled-components"
import { Text, getColor } from "@netdata/netdata-ui"

const BaseAnchor = styled("a")`
  && {
    color: ${getColor("primary")};

    :hover {
      color: ${getColor("primary")};
    }

    :visited {
      color: ${getColor("accent")};
    }
  }
`

type AnchorProps = React.ComponentPropsWithRef<"a"> & {
  Component?: React.ElementType
}

const Anchor = ({ Component = Text, ...rest }: AnchorProps): any => (
  <Component as={BaseAnchor} {...rest} />
)

export default Anchor
