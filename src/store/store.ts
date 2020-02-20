import { compose, applyMiddleware, createStore } from "redux"
import createSagaMiddleware from "redux-saga"
import rootReducer from "./root-reducer"
import { rootSaga } from "./root-saga"

const sagaMiddleware = createSagaMiddleware()

const reduxDevTools = process.env.NODE_ENV === "development"
  && window.__REDUX_DEVTOOLS_EXTENSION__
  // @ts-ignore
  && window.__REDUX_DEVTOOLS_EXTENSION__({ name: "Dashboard Charts" })

const composeMiddlewaresWithDevTools = () => (reduxDevTools
  ? compose(applyMiddleware(sagaMiddleware), reduxDevTools)
  : compose(applyMiddleware(sagaMiddleware)))

export const configureStore = () => {
  const store = createStore(
    rootReducer,
    composeMiddlewaresWithDevTools(),
  )
  sagaMiddleware.run(rootSaga)
  return store
}

export const store = configureStore()
