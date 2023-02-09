import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
// import { reducer as formReducer } from 'redux-form'

import ReduxPersistConfig from '../Config/ReduxPersistConfig'
import configureStore from './CreateStore'
import rootSaga from '../Sagas'

const reducers = () => {
  /* ------------- Assemble The Reducers ------------- */
  const appReducer = combineReducers({
    forgotPassword: require('./ForgotPasswordRedux').reducer,
    updateOrder: require('./UpdateOrderRedux').reducer,
    getOrder: require('./GetOrderRedux').reducer,
    listOrder: require('./ListOrderRedux').reducer,
    createOrder: require('./CreateOrderRedux').reducer,
    register: require('./RegisterRedux').reducer,
    login: require('./LoginRedux').reducer,
  })

  const rootReducer = (state, action) => {
    if (action.type === 'LOGOUT_SUCCESS') {
      state = undefined
    } else if (action.type === 'CLEAR_DATA') {
      state = {
        ...appReducer({}, {}),
        login: (state && state.login) || {},
        startup: (state && state.startup) || {},
      }
    }
    return appReducer(state, action)
  }

  const persistedReducer = persistReducer(ReduxPersistConfig.storeConfig, rootReducer)

  return configureStore(persistedReducer, rootSaga)
}
export default reducers
