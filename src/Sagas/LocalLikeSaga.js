import { call, put } from 'redux-saga/effects'
import LocalLikeActions from '../Redux/ LocalLikeRedux'
import LoginActions from '../Redux/LoginRedux'
export function * localLike (api, {params}) {
  try {
    const res = yield call(api, params)
    if (res === 'Unauthorized') {
      yield put(LoginActions.loginFailure())
      return
    }
    if (res.success) {
      yield put(LocalLikeActions.localLikeSuccess(res.data))
    } else {
      yield put(LocalLikeActions.localLikeFailure(res.error))
    }
  } catch (error) {
    yield put(LocalLikeActions.localLikeFailure(error.message))
  }
}
