import { takeLatest, all } from 'redux-saga/effects'
import api from '../Services/Api'
/* ------------- Types ------------- */
import { ForgotPasswordTypes } from '../Redux/ForgotPasswordRedux'
import { UpdateOrderTypes } from '../Redux/UpdateOrderRedux'
import { GetOrderTypes } from '../Redux/GetOrderRedux'
import { ListOrderTypes } from '../Redux/ListOrderRedux'
import { CreateOrderTypes } from '../Redux/CreateOrderRedux'
import { RegisterTypes } from '../Redux/RegisterRedux'

import { StartupTypes } from '../Redux/StartupRedux'
import { LoginTypes } from '../Redux/LoginRedux'
/* ------------- Sagas ------------- */
import { forgotPassword } from './ForgotPasswordSaga'
import { updateOrder } from './UpdateOrderSaga'
import { getOrder } from './GetOrderSaga'
import { listOrder } from './ListOrderSaga'
import { createOrder } from './CreateOrderSaga'
import { register } from './RegisterSaga'
import { startup } from './StartupSagas'
import { login, logout } from './LoginSagas'
/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.

/* ------------- Connect Types To Sagas ------------- */

export default function* root() {
  yield all([
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP, startup, api),

    // tool generated sagas
    takeLatest(ForgotPasswordTypes.FORGOT_PASSWORD_REQUEST, forgotPassword, api.forgotPassword),
    takeLatest(UpdateOrderTypes.UPDATE_ORDER_REQUEST, updateOrder, api.updateOrder),
    takeLatest(GetOrderTypes.GET_ORDER_REQUEST, getOrder, api.getOrder),
    takeLatest(ListOrderTypes.LIST_ORDER_REQUEST, listOrder, api.listOrder),
    takeLatest(CreateOrderTypes.CREATE_ORDER_REQUEST, createOrder, api.createOrder),
    takeLatest(RegisterTypes.REGISTER_REQUEST, register, api.register),
    // Login
    takeLatest(LoginTypes.LOGIN_REQUEST, login, api.login),
    takeLatest(LoginTypes.LOGOUT_REQUEST, logout, api.logout),
  ])
}
