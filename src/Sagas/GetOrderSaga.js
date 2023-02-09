import { call, put } from 'redux-saga/effects'
import GetOrderActions from '../Redux/GetOrderRedux'
import LoginActions from '../Redux/LoginRedux'
export function* getOrder(api, { params }) {
  try {
    const res = yield call(api, params)
    if (res === 'Unauthorized') {
      yield put(LoginActions.loginFailure())
      return
    }
    if (res.data) {
      yield put(GetOrderActions.getOrderSuccess(res.data))
    } else {
      yield put(GetOrderActions.getOrderFailure(res))
    }
  } catch (error) {
    yield put(GetOrderActions.getOrderFailure(error.message))
  }
}
