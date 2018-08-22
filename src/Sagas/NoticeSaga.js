import { call, put } from 'redux-saga/effects'
import NoticeActions from '../Redux/NoticeRedux'
import LoginActions from '../Redux/LoginRedux'
export function * notice (api, {params}) {
  try {
    const res = yield call(api, params)
    if (res === 'Unauthorized') {
      yield put(LoginActions.loginFailure())
      return
    }
    if (res.success) {
      yield put(NoticeActions.noticeSuccess(res.data))
    } else {
      yield put(NoticeActions.noticeFailure(res.error))
    }
  } catch (error) {
    yield put(NoticeActions.noticeFailure(error.message))
  }
}
