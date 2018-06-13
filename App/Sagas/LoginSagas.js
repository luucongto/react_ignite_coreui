import { call, put } from 'redux-saga/effects'
import LoginActions from '../Redux/LoginRedux'

export function * login (loginAPI, { username, password }) {
  try {
    const res = yield call(loginAPI, {username, password})
    if (res.data && res.data.success) {
      yield put(LoginActions.loginSuccess({data: res.data.token}))
    } else {
      yield put(LoginActions.loginFailure(res.data.msg))
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
