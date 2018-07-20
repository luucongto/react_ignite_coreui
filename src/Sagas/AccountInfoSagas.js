import { call, put } from 'redux-saga/effects'
import AccountInfoActions from '../Redux/AccountInfoRedux'

export function * accountInfo (api) {
  try {
    const res = yield call(api)
    console.log('res', res)
    if (res.success) { yield put(AccountInfoActions.accountInfoSuccess(res.data)) } else yield put(AccountInfoActions.accountInfoFailure(res.error))
  } catch (error) {
    yield put(AccountInfoActions.accountInfoFailure(error.message))
  }
}
