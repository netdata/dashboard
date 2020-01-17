import React, { useRef, useEffect } from "react"
import classNames from "classnames"

import { useSelector } from "store/redux-separate-context"
import { ModalPortal } from "domains/dashboard/components/modal-portal"
import {
  selectAmountOfCharts, selectAmountOfFetchedCharts, selectNameOfAnyFetchingChart,
} from "domains/chart/selectors"

import "./print-modal.scss"

const TIMEOUT_DURATION_TO_MAKE_SURE_ALL_CHARTS_HAVE_BEEN_RENDERED = 1000

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

  const amountOfCharts = useSelector(selectAmountOfCharts)
  const amountOfFetchedCharts = useSelector(selectAmountOfFetchedCharts)
  const nameOfAnyFetchingChart = useSelector(selectNameOfAnyFetchingChart)

  const percentage = amountOfCharts === 0
    ? 0
    : (amountOfFetchedCharts / amountOfCharts) * 100

  useEffect(() => {
    if (percentage === 100) {
      setTimeout(() => {
        // in case browser will not be able to close the window
        window.$(printModalElement.current).modal("hide")
        window.print()
        window.close()
      }, TIMEOUT_DURATION_TO_MAKE_SURE_ALL_CHARTS_HAVE_BEEN_RENDERED)
    }
  }, [percentage])


  const progressBarText = nameOfAnyFetchingChart
    && `${Math.round(percentage)}%, ${nameOfAnyFetchingChart}`


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
                  aria-valuenow={percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  style={{
                    minWidth: "2em",
                    width: `${percentage}%`,
                  }}
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
                  >
                    {progressBarText}
                  </span>
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
