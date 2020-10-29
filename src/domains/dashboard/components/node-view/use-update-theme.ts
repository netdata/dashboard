import { useContext, useMemo } from "react"
import { ThemeContext } from "styled-components"

export const useUpdateTheme = () => {
  const theme = useContext(ThemeContext)
  const currentTheme = window.NETDATA.themes.current

  useMemo(() => {
    if (!theme.colors) return

    window.NETDATA.themes.current = {
      ...currentTheme,
      background: theme.colors.elementBackground,
      foreground: theme.colors.border,
      grid: theme.colors.disabled,
      axis: theme.colors.elementBackground,
      highlight: theme.colors.attention,
      colors: [
        "#B0E952",
        "#FC8D5E",
        "#3366CC",
        "#DC3912",
        "#109618",
        "#FF9900",
        "#990099",
        "#DD4477",
        "#3B3EAC",
        "#66AA00",
        "#0099C6",
        "#B82E2E",
        "#AAAA11",
        "#5574A6",
        "#994499",
        "#22AA99",
        "#6633CC",
        "#E67300",
        "#316395",
        "#8B0707",
        "#329262",
        "#3B3EAC",
      ],
      easypiechart_track: theme.colors.disabled,
      easypiechart_scale: theme.colors.elementBackground,
      gauge_pointer: theme.colors.border,
      gauge_stroke: theme.colors.disabled,
      gauge_gradient: false,
      d3pie: {
        title: "#333333",
        subtitle: "#666666",
        footer: "#888888",
        other: "#aaaaaa",
        mainlabel: "#333333",
        percentage: "#dddddd",
        value: "#aaaa22",
        tooltip_bg: "#000000",
        tooltip_fg: "#efefef",
        segment_stroke: "#ffffff",
        gradient_color: "#000000",
      },
    }

    window.NETDATA.colors = currentTheme.colors
  }, [theme, currentTheme])
}
