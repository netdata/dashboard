import React, { useRef, useEffect } from "react"
import { ModalPortal } from "domains/dashboard/components/modal-portal"
import classNames from "classnames"

import "./print-modal.scss"

export const PrintModal = () => {
  const printModalElement = useRef<HTMLDivElement>(null)
  const isFetchingMetrics = true

  useEffect(() => {
    // todo replace bootstrap with newer solution (custom or react-compatible library)
    if (printModalElement.current) {
      const $element = window.$(printModalElement.current)
      $element.modal("show")
    }
  }) // render just once

  return (
    <ModalPortal>
      <div
        ref={printModalElement}
        className="modal fade"
        id="printModal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="printModalLabel"
        data-keyboard="false"
        data-backdrop="static"
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className={classNames(
                  "close",
                  { "print-modal__close-button--disabled": isFetchingMetrics },
                )}
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
              <h4 className="modal-title" id="printModalLabel">
                Preparing dashboard for printing...
              </h4>
            </div>
            <div className="modal-body">
              Please wait while we initialize and render all the charts on the dashboard.
              <div
                className="progress progress-striped active"
                style={{ height: "2em" }}
              >
                <div
                  id="printModalProgressBar"
                  className="progress-bar progress-bar-info"
                  role="progressbar"
                  aria-valuenow={0}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  style={{ minWidth: "2em" }}
                >
                  <span
                    id="printModalProgressBarText"
                    style={{
                      paddingLeft: 10,
                      paddingTop: 4,
                      fontSize: "1.2em",
                      textAlign: "left",
                      width: "100%",
                      position: "absolute",
                      display: "block",
                      color: "black",
                    }}
                  />
                </div>
              </div>
              The print dialog will appear as soon as we finish rendering the page.
            </div>
            <div className="modal-footer" />
          </div>
        </div>
      </div>
    </ModalPortal>
  )
}
