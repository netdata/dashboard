import Description from "domains/charts/description"
import { withMenuGroup } from "domains/charts/menuGroup"

export const ChartMenuGroupDescriptionContainer = withMenuGroup(Description, ({ info }) => ({
  children: info,
}))
