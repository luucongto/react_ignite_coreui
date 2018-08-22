import { call, put } from 'redux-saga/effects'
import AccountInfoActions from '../Redux/AccountInfoRedux'
import LoginActions from '../Redux/LoginRedux'
export function * accountInfo (api, {params}) {
  try {
    const res = yield call(api, params)
    if (res === 'Unauthorized') {
      yield put(LoginActions.loginFailure())
      return
    }
    if (res.success) {
      yield put(AccountInfoActions.accountInfoSuccess(res.data))
    } else {
      yield put(AccountInfoActions.accountInfoFailure(res.error))
    }
  } catch (error) {
    yield put(AccountInfoActions.accountInfoFailure(error.message || 'unauthorized'))
  }
}
