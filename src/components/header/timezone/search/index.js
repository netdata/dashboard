import React, { forwardRef } from "react"
import SearchInput from "./searchInput"

const Search = forwardRef(({ value, onChange }, ref) => (
  <SearchInput inputRef={ref} value={value} onChange={onChange} placeholder="Search" metaShrinked />
))

export default Search
