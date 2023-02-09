import { select } from 'redux-saga/effects'
import { loginTokenSelector } from '../Redux/LoginRedux'
export function* startup(api) {
  const loginToken = yield select(loginTokenSelector)
  if (loginToken && loginToken) {
    api.authenticated(loginToken)
  }
}
