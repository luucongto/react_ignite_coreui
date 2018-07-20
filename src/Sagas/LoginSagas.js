import { call, put } from 'redux-saga/effects'
import LoginActions from '../Redux/LoginRedux'

export function * login (loginAPI, { username, password }) {
  try {
    const res = yield call(loginAPI, {username, password})
    if (res && res.success) {
      yield put(LoginActions.loginSuccess({token: res.token}))
    } else {
      yield put(LoginActions.loginFailure(res.msg))
    }
  } catch (error) {
    yield put(LoginActions.loginFailure(error.message))
  }
}

export function * logout (logoutAPI) {
  try {
    yield call(logoutAPI)
    yield put(LoginActions.logoutSuccess())
  } catch (error) {
    yield put(LoginActions.logoutFailure(error.message))
  }
}
