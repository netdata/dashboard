import React, { forwardRef } from "react"
import styled from "styled-components"

const Container = styled.div`
  display: block;
`

const ProceededChartDisclaimer = forwardRef((
  props: React.HTMLAttributes<HTMLElement>,
  ref: React.Ref<HTMLDivElement>,
) => (
  <Container ref={ref} className="dygraph__history-tip" data-testid="proceededChartDisclaimer">
    <span className="dygraph__history-tip-content">
      Want to extend your history of real-time metrics?
      <br />
      <a href="https://docs.netdata.cloud/docs/configuration-guide/#increase-the-metrics-retention-period" target="_blank" rel="noopener noreferrer" data-testid="proceededChartDisclaimer-configure">
        Configure Netdata&apos;s&nbsp;
        <b>history</b>
      </a>
      &nbsp;or use the&nbsp;
      <a href="https://docs.netdata.cloud/database/engine/" target="_blank" rel="noopener noreferrer" data-testid="proceededChartDisclaimer-engine">DB engine</a>
      .
    </span>
  </Container>
))

export default ProceededChartDisclaimer
