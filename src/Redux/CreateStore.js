import { createStore, applyMiddleware } from 'redux'
import { persistStore } from 'redux-persist'
import createSagaMiddleware from 'redux-saga'
import { createLogger } from 'redux-logger'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import { updateReducers } from '../Services/RehydrationServices'
import ReduxPersistConfig from '../Config/ReduxPersistConfig'
import DevConfig from '../Config/DevConfig'

// creates the store
const createStoreFunction = (rootReducer, rootSaga) => {
  /* ------------- Redux Configuration ------------- */

  const middleware = []

  /* ------------- Logger Middleware ------------- */

  if (DevConfig.__DEV__ && DevConfig.reduxLogging) {
    const loggerMiddleware = createLogger()
    middleware.push(loggerMiddleware)
  } else if (DevConfig.__DEV__ && !DevConfig.reduxLogging) {
    console.log(
      'Redux logger is off. To switch it on set reduxLogging to true in Config/DevConfig.js',
    )
  }

  /* ------------- Saga Middleware ------------- */

  const sagaMiddleware = createSagaMiddleware()
  middleware.push(sagaMiddleware)

  /* ------------- Dev tools extension Enhancer ------------- */

  const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middleware)))

  // configure persistStore and check reducer version number
  let persistor
  if (ReduxPersistConfig.active) {
    persistor = updateReducers(store)
  } else {
    persistor = persistStore(store)
  }

  // kick off root saga
  sagaMiddleware.run(rootSaga)

  return { persistor, store }
}

export default createStoreFunction
