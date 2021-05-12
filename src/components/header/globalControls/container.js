import styled from "styled-components"
import { Flex, getRgbColor } from "@netdata/netdata-ui"

const getBackground = ({ theme, isPlaying }) => {
  const { name } = theme
  const background =
    name === "Dark"
      ? `${getRgbColor(isPlaying ? ["green", "netdata"] : ["neutral", "blackhaze"], 0.3)({ theme })}`
      : getRgbColor(isPlaying ? ["green", "frostee"] : ["neutral", "blackhaze"])({ theme })

  return `background: ${background};`
}

const Container = styled(Flex)`
  ${getBackground};
`

export default Container
