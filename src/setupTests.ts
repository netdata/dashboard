import { configure } from "enzyme"
import Adapter from "enzyme-adapter-react-16"

configure({ adapter: new Adapter() })

const NETDATA: any = {
  options: {
    current: {
      timezone: "default",
    },
  },
  themes: {
    current: {},
  },
  updateTheme: () => {},
}


// @ts-ignore
global.IntersectionObserver = class IntersectionObserver {
  static observe() {
    return null
  }

  static unobserve() {
    return null
  }
}

// @ts-ignore
global.NETDATA = NETDATA
