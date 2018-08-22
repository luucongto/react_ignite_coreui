import { call, put } from 'redux-saga/effects'
import SoldProductActions from '../Redux/SoldProductRedux'
import LoginActions from '../Redux/LoginRedux'
export function * soldProduct (api, {params}) {
  try {
    const res = yield call(api, params)
    if (res === 'Unauthorized') {
      yield put(LoginActions.loginFailure())
      return
    }
    if (res.success) {
      yield put(SoldProductActions.soldProductSuccess(res.data))
    } else {
      yield put(SoldProductActions.soldProductFailure(res.error))
    }
  } catch (error) {
    yield put(SoldProductActions.soldProductFailure(error.message))
  }
}
