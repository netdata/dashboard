import { renderHook, act } from "@testing-library/react-hooks"
import useToggle from "."

it("returns the false by default", () => {
  const { result } = renderHook(value => useToggle(value), { initialProps: undefined })
  expect(result.current[0]).toBe(false)
})

it("returns the initial value", () => {
  const { result } = renderHook(value => useToggle(value), { initialProps: true })
  expect(result.current[0]).toBe(true)
})

it("toggles the value", () => {
  const { result } = renderHook(value => useToggle(value), { initialProps: true })
  const [, toggle] = result.current
  act(() => {
    toggle()
  })
  expect(result.current[0]).toBe(false)
  act(() => {
    toggle()
  })
  expect(result.current[0]).toBe(true)
})

it("toggles on", () => {
  const { result } = renderHook(value => useToggle(value), { initialProps: false })
  const [, , toggleOn] = result.current
  act(() => {
    toggleOn()
  })
  expect(result.current[0]).toBe(true)
})

it("toggles off", () => {
  const { result } = renderHook(value => useToggle(value), { initialProps: true })
  const [, , , toggleOff] = result.current
  act(() => {
    toggleOff()
  })
  expect(result.current[0]).toBe(false)
})
