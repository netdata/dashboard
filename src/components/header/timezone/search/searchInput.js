import styled from "styled-components"
import { TextInput } from "@netdata/netdata-ui"

const SearchInput = styled(TextInput)`
  & input {
    background: transparent;
  }

  & > label {
    margin-bottom: 0;
  }
`
export default SearchInput
