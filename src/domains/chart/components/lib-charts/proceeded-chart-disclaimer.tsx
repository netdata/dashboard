import React, { forwardRef } from "react"
import styled from "styled-components"
import classNames from "classnames"

const Container = styled.div`
  display: block !important; // ìmportant to fix styled-components race condition
`

interface Props {
  centerHorizontally?: boolean
}
const ProceededChartDisclaimer = forwardRef(
  ({ centerHorizontally }: Props, ref: React.Ref<HTMLDivElement>) => (
    <Container
      ref={ref}
      className={classNames("dygraph__history-tip", {
        "dygraph__history-tip--centered": centerHorizontally,
      })}
      data-testid="proceededChartDisclaimer"
    >
      <span className="dygraph__history-tip-content">
        <span className="dygraph__history-tip-header">Want to see more historical metrics?</span>
        <br />
        Configure Netdata&apos;s
        <br />
        <a
          href="https://docs.netdata.cloud/docs/configuration-guide/#increase-the-metrics-retention-period"
          target="_blank"
          rel="noopener noreferrer"
          data-testid="proceededChartDisclaimer-configure"
        >
          time-series database.
        </a>
      </span>
    </Container>
  ),
)

export default ProceededChartDisclaimer
