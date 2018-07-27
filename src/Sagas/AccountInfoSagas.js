import {
  call,
  put
} from 'redux-saga/effects'
import AccountInfoActions from '../Redux/AccountInfoRedux'
import LoginActions from '../Redux/LoginRedux'
export function * accountInfo (api) {
  try {
    const res = yield call(api)
    console.log('res', res)
    if (res.success) {
      yield put(AccountInfoActions.accountInfoSuccess(res.data))
    } else if (res.error) {
      yield put(AccountInfoActions.accountInfoFailure(res.error))
    } else {
      if (res === 'Unauthorized') {
        yield put(LoginActions.loginFailure())
      }
    }
  } catch (error) {
    yield put(AccountInfoActions.accountInfoFailure(error.message))
  }
}
