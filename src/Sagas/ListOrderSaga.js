import { call, put } from 'redux-saga/effects'
import ListOrderActions from '../Redux/ListOrderRedux'
import LoginActions from '../Redux/LoginRedux'
export function* listOrder(api, { params }) {
  try {
    const res = yield call(api, params)
    if (res === 'Unauthorized') {
      yield put(LoginActions.loginFailure())
      return
    }
    if (res.data) {
      yield put(ListOrderActions.listOrderSuccess(res))
    } else {
      yield put(ListOrderActions.listOrderFailure(res))
    }
  } catch (error) {
    yield put(ListOrderActions.listOrderFailure(error.message))
  }
}
