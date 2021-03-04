import React, { useState, memo } from "react"
import { render, fireEvent } from "@testing-library/react"
import { createContext } from "use-context-selector"
import useContextSelector from "./index"

const Context = createContext()

const Component = memo(({ setState, onRender, useSelector, selector }) => {
  const state = useSelector(Context, selector)
  onRender()
  return (
    <button data-testid="toggle" onClick={() => setState(s => ({ ...s, counter: s.counter + 1 }))}>
      {state.title}
    </button>
  )
})

const Provider = ({ onRender, useSelector, selector }) => {
  const [state, setState] = useState({ title: "myTitle", counter: 0 })
  return (
    <Context.Provider value={state}>
      <Component
        setState={setState}
        onRender={onRender}
        useSelector={useSelector}
        selector={selector}
      />
    </Context.Provider>
  )
}

it("rerenders", () => {
  const onRender = jest.fn()
  const { getByTestId } = render(<Provider onRender={onRender} useSelector={useContextSelector} />)
  expect(onRender).toBeCalledTimes(1)
  fireEvent.click(getByTestId("toggle"))
  expect(onRender).toBeCalledTimes(2)
  fireEvent.click(getByTestId("toggle"))
  expect(onRender).toBeCalledTimes(3)
})

it("doesn't rerender", () => {
  const onRender = jest.fn()
  const { getByTestId } = render(
    <Provider
      onRender={onRender}
      useSelector={useContextSelector}
      selector={({ title }) => ({ title })}
    />
  )
  expect(onRender).toBeCalledTimes(1)
  fireEvent.click(getByTestId("toggle"))
  expect(onRender).toBeCalledTimes(1)
  fireEvent.click(getByTestId("toggle"))
  expect(onRender).toBeCalledTimes(1)
})
