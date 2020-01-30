import React, { useRef, useEffect } from "react"
import classNames from "classnames"

import { useSelector } from "store/redux-separate-context"
import { selectShowHelp } from "domains/global/selectors"
import { Icon, IconType } from "components/icon"
import { Button } from "components/button"

type ClickCallback = (event: React.MouseEvent) => void
interface ToolboxButtonProps {
  className?: string
  iconType: IconType
  onClick?: ClickCallback
  onDoubleClick?: (event: React.MouseEvent) => void
  onMouseDown?: (event: React.MouseEvent) => void
  onTouchStart?: (event: React.TouchEvent) => void
  popoverContent: string
  popoverTitle: string
}
export const ToolboxButton = ({
  className,
  iconType,
  onClick,
  onDoubleClick,
  onMouseDown,
  onTouchStart,
  popoverContent,
  popoverTitle,
}: ToolboxButtonProps) => {
  const buttonRef = useRef(null)
  const showHelp = useSelector(selectShowHelp)
  useEffect(() => {
    if (buttonRef.current && showHelp) {
      window.$(buttonRef.current).popover({
        container: "body",
        animation: false,
        html: true,
        trigger: "hover",
        placement: "bottom",
        delay: {
          show: window.NETDATA.options.current.show_help_delay_show_ms,
          hide: window.NETDATA.options.current.show_help_delay_hide_ms,
        },
        title: popoverTitle,
        content: popoverContent,
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Button
      className={classNames(className)}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      ref={buttonRef}
    >
      <Icon iconType={iconType} />
    </Button>
  )
}
