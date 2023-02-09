import { call, put } from 'redux-saga/effects'
import ForgotPasswordActions from '../Redux/ForgotPasswordRedux'
import LoginActions from '../Redux/LoginRedux'
export function* forgotPassword(api, { params }) {
  try {
    const res = yield call(api, params)
    if (res === 'Unauthorized') {
      yield put(LoginActions.loginFailure())
      return
    }
    if (res.data) {
      yield put(ForgotPasswordActions.forgotPasswordSuccess(res.data))
    } else {
      yield put(ForgotPasswordActions.forgotPasswordFailure(res))
    }
  } catch (error) {
    yield put(ForgotPasswordActions.forgotPasswordFailure(error.message))
  }
}
