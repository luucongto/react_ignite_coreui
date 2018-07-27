import { call, put } from 'redux-saga/effects'
import LoginActions from '../Redux/LoginRedux'

export function * login (loginAPI, {params}) {
  try {
    console.log(params)
    const res = yield call(loginAPI, params)
    if (res && res.success) {
      yield put(LoginActions.loginSuccess(res))
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
