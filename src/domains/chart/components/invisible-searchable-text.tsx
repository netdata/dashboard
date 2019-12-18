import React from "react"

import { Attributes } from "domains/chart/utils/transformDataAttributes"

interface Props {
  attributes: Attributes
}

// rendered on init (for example when chart is not visible)
// and when it's rendering after being hidden previously
export const InvisibleSearchableText = ({
  attributes,
}: Props) => (
  <span style={{ position: "absolute", opacity: 0, width: 0 }}>
    {attributes.id}
  </span>
)
