import { takeLatest, all } from 'redux-saga/effects'
import api from '../Services/Api'
/* ------------- Types ------------- */
import { SellerTypes } from '../Redux/SellerRedux'

import { StartupTypes } from '../Redux/StartupRedux'
import { LoginTypes } from '../Redux/LoginRedux'
import { AccountInfoTypes } from '../Redux/AccountInfoRedux'
import { ServerSettingTypes } from '../Redux/ServerSettingRedux'
import { NoticeTypes } from '../Redux/NoticeRedux'
import { ProductTypes } from '../Redux/ProductRedux'
import {SoldProductTypes} from '../Redux/SoldProductRedux'
/* ------------- Sagas ------------- */
import { seller } from './SellerSaga'

import { startup } from './StartupSagas'
import { login, logout } from './LoginSagas'
import { accountInfo } from './AccountInfoSagas'
import { serverSetting } from './ServerSettingSagas'
import { notice } from './NoticeSaga'
import { product } from './ProductSaga'
import {soldProduct} from './SoldProductSaga'
/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  yield all([
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP, startup, api),

    // tool generated sagas
    takeLatest(SellerTypes.SELLER_REQUEST, seller, api.seller),
    // Login
    takeLatest(LoginTypes.LOGIN_REQUEST, login, api.login),
    takeLatest(LoginTypes.LOGOUT_REQUEST, logout, api.logout),
    takeLatest(AccountInfoTypes.ACCOUNT_INFO_REQUEST, accountInfo, api.accountInfo),
    takeLatest(ServerSettingTypes.SERVER_SETTING_REQUEST, serverSetting, api.serverSetting),
    takeLatest(NoticeTypes.NOTICE_REQUEST, notice, api.notice),
    takeLatest(ProductTypes.PRODUCT_REQUEST, product, api.product),
    takeLatest(SoldProductTypes.SOLD_PRODUCT_REQUEST, soldProduct, api.soldProduct)
  ])
}
