import { call, put } from 'redux-saga/effects'
import LoginActions from '../Redux/LoginRedux'

export function* login(loginAPI, { params }) {
  try {
    const res = yield call(loginAPI, params)
    if (res.data) {
      yield put(LoginActions.loginSuccess(res.data))
    } else {
      yield put(LoginActions.loginFailure(res))
    }
  } catch (error) {
    yield put(LoginActions.loginFailure(error.message))
  }
}

export function* logout(logoutAPI) {
  try {
    yield call(logoutAPI)
    yield put(LoginActions.logoutSuccess())
  } catch (error) {
    yield put(LoginActions.logoutFailure(error.message))
  }
}
