import { getColor, getRgbColor } from "@netdata/netdata-ui"
import styled from "styled-components"

export const StyledDateInput = styled.input`
  width: 100%;
  text-align: center;
  border: 1px solid ${getColor("border")};
  color: inherit;
  background: ${getColor("mainBackground")};
  box-sizing: border-box;
  border-radius: 4px;
  padding: 4px;
  height: 32px;
  margin-left: 20px;
  margin-right: 20px;
  outline: none;
  &:focus {
    border: 1px solid ${getColor("primary")};
  }
`
export const StyledCalendar = styled.div`
  background: ${getColor("mainBackground")};
  border: 0;
  .react-datepicker {
    &__navigation {
      top: 8px;
      &-icon::before {
        border-color: ${getColor("text")};
      }
    }
    &__header {
      background: ${getColor("mainBackground")};
      border: 0;
      .react-datepicker__current-month {
        color: ${getColor("main")};
        font-weight: normal;
      }
      .react-datepicker__day-name {
        color: ${getColor("textLite")};
      }
    }
    &__day {
      color: ${getColor("main")};
      &:hover {
        background: ${getColor("elementBackground")};
      }
      &--disabled {
        color: ${getColor("textLite")};
        &:hover {
          background: inherit;
        }
      }
      &--keyboard-selected,
      &--keyboard-selected:hover {
        color: ${getColor("main")};
        background: inherit;
        border-radius: inherit;
      }
      &--selected,
      &--selected:hover {
        color: ${getColor("bright")};
        background: ${getColor("primary")};
        border-radius: 8px;
      }
      &--in-selecting-range,
      &--in-range {
        color: ${getColor("primary")};
        background: ${getColor("elementBackground")};
        border-radius: 0;
      }
      &--selecting-range-start,
      &--range-start {
        color: ${getColor("bright")};
        background: ${getColor("primary")};
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
        &:hover {
          color: ${getColor("bright")};
          background: ${getRgbColor(["green", "netdata"], 0.8)};
          border-radius: 0;
          border-top-left-radius: 8px;
          border-bottom-left-radius: 8px;
        }
      }
      &--selecting-range-end,
      &--range-end {
        color: ${getColor("bright")};
        background: ${getColor("primary")};
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
        &:hover {
          color: ${getColor("bright")};
          background: ${getRgbColor(["green", "netdata"], 0.8)};
          border-top-right-radius: 8px;
          border-bottom-right-radius: 8px;
        }
      }
    }
  }
`
