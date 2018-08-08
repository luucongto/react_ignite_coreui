import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
// import { reducer as formReducer } from 'redux-form'

import ReduxPersistConfig from '../Config/ReduxPersistConfig'
import configureStore from './CreateStore'
import rootSaga from '../Sagas'

export default () => {
  /* ------------- Assemble The Reducers ------------- */
  const appReducer = combineReducers({
    login: require('./LoginRedux').reducer,
    accountInfo: require('./AccountInfoRedux').reducer,
    bidder: require('./BidderRedux').reducer,
    serverSetting: require('./ServerSettingRedux').reducer,
    product: require('./ProductRedux').reducer,
    soldProduct: require('./SoldProductRedux').reducer,
    notice: require('./NoticeRedux').reducer,
    localLike: require('./LocalLikeRedux').reducer
  })

  const rootReducer = (state, action) => {
    if (action.type === 'LOGOUT_SUCCESS') {
      state = undefined
    } else if (action.type === 'CLEAR_DATA') {
      state = {
        ...appReducer({}, {}),
        login: (state && state.login) || {},
        startup: (state && state.startup) || {}
      }
    }
    return appReducer(state, action)
  }

  const persistedReducer = persistReducer(ReduxPersistConfig.storeConfig, rootReducer)

  return configureStore(persistedReducer, rootSaga)
}
