import React from "react"
import styled from "styled-components"
import { ToastContainer, ToastContainerProps } from "react-toastify"
import "react-toastify/dist/ReactToastify.min.css"

import { getColor } from "@netdata/netdata-ui"

import { notificationsZIndex } from "styles/z-index"

const WrappedToastContainer = ({
  className,
  ...rest
}: ToastContainerProps & { className?: string }) => (
  <div className={className}>
    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
    <ToastContainer {...rest} closeButton={false} />
  </div>
)

export const NotificationsContainer = styled(WrappedToastContainer)<ToastContainerProps>`
  .Toastify__toast-container {
    position: fixed;
    width: unset;
    min-width: 400px;
    max-width: 500px;
    ${notificationsZIndex};
    color: ${getColor("text")};
  }
  .Toastify__toast {
    padding: 0;
    padding-top: 5px;
  }
  .Toastify__toast--error {
    background: ${getColor(["red", "lavender"])};
    border: 1px solid ${getColor("error")};
  }
  .Toastify__toast--warning {
  }
  .Toastify__toast--success {
    background: ${getColor(["green", "frostee"])};
    border: 1px solid ${getColor("success")};
  }
  .Toastify__toast-body {
  }
  .Toastify__progress-bar {
    bottom: unset;
    top: 0;
  }
  .Toastify__progress-bar--success {
    background-color: ${getColor("success")};
  }
  .Toastify__progress-bar--error {
    background-color: ${getColor("error")};
  }
`
