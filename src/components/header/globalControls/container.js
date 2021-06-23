import styled from "styled-components"
import { Flex, getRgbColor } from "@netdata/netdata-ui"

const getBackground = ({ theme, isPlaying }) => {
  const { name } = theme

  const background =
    name === "Dark"
      ? getRgbColor(isPlaying ? ["green", "netdata"] : ["neutral", "tuna"], isPlaying ? 0.3 : 1)
      : getRgbColor(isPlaying ? ["green", "frostee"] : ["neutral", "blackhaze"])

  return background({ theme })
}

const Container = styled(Flex)`
  background: ${getBackground};
`

export default Container
