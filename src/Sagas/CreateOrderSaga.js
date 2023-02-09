import { call, put } from 'redux-saga/effects'
import CreateOrderActions from '../Redux/CreateOrderRedux'
import LoginActions from '../Redux/LoginRedux'
export function* createOrder(api, { params }) {
  try {
    const res = yield call(api, params)
    if (res === 'Unauthorized') {
      yield put(LoginActions.loginFailure())
      return
    }
    if (res.data) {
      yield put(CreateOrderActions.createOrderSuccess(res))
    } else {
      yield put(CreateOrderActions.createOrderFailure(res))
    }
  } catch (error) {
    yield put(CreateOrderActions.createOrderFailure(error.message))
  }
}
