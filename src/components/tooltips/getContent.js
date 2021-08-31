import React from "react"
import CustomTooltip from "@/src/components/tooltips/customTooltip"

const getContent = (content, { isBasic }) => {
  const contentNode = typeof content === "function" ? content() : content
  if (typeof content === "string" || isBasic) {
    return <CustomTooltip isBasic={isBasic}>{contentNode}</CustomTooltip>
  }
  return contentNode
}

export default getContent
