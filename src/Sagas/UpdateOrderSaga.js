import { call, put } from 'redux-saga/effects'
import UpdateOrderActions from '../Redux/UpdateOrderRedux'
import LoginActions from '../Redux/LoginRedux'
export function* updateOrder(api, { params }) {
  try {
    const res = yield call(api, params)
    if (res === 'Unauthorized') {
      yield put(LoginActions.loginFailure())
      return
    }
    if (res.data) {
      yield put(UpdateOrderActions.updateOrderSuccess(res.data))
    } else {
      yield put(UpdateOrderActions.updateOrderFailure(res))
    }
  } catch (error) {
    yield put(UpdateOrderActions.updateOrderFailure(error.message))
  }
}
