import { call, put } from 'redux-saga/effects'
import ProductActions from '../Redux/ProductRedux'
import LoginActions from '../Redux/LoginRedux'
export function * product (api, {params}) {
  try {
    const res = yield call(api, params)
    if (res === 'Unauthorized') {
      yield put(LoginActions.loginFailure())
      return
    }
    if (res.success) {
      yield put(ProductActions.productSuccess(res.data))
    } else {
      yield put(ProductActions.productFailure(res.error))
    }
  } catch (error) {
    yield put(ProductActions.productFailure(error.message))
  }
}
