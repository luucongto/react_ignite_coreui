import { takeLatest, all } from 'redux-saga/effects'
import api from '../Services/Api'
/* ------------- Types ------------- */

import { StartupTypes } from '../Redux/StartupRedux'
import { LoginTypes } from '../Redux/LoginRedux'
import { AccountInfoTypes } from '../Redux/AccountInfoRedux'
/* ------------- Sagas ------------- */

import { startup } from './StartupSagas'
import { login, logout } from './LoginSagas'
import { accountInfo } from './AccountInfoSagas'
/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  yield all([
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP, startup, api),

    // Login
    takeLatest(LoginTypes.LOGIN_REQUEST, login, api.login),
    takeLatest(LoginTypes.LOGOUT_REQUEST, logout, api.logout),
    takeLatest(AccountInfoTypes.ACCOUNT_INFO_REQUEST, accountInfo, api.accountInfo)
  ])
}
