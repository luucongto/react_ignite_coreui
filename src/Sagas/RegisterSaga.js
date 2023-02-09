import { call, put } from 'redux-saga/effects'
import RegisterActions from '../Redux/RegisterRedux'
import LoginActions from '../Redux/LoginRedux'
export function* register(api, { params }) {
  try {
    const res = yield call(api, params)
    if (res === 'Unauthorized') {
      yield put(LoginActions.loginFailure())
      return
    }
    if (res.success) {
      yield put(RegisterActions.registerSuccess(res))
    } else {
      yield put(RegisterActions.registerFailure(res))
    }
  } catch (error) {
    console.log(error)
    yield put(RegisterActions.registerFailure(error.message))
  }
}
