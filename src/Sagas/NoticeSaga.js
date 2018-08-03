import { call, put } from 'redux-saga/effects'
import NoticeActions from '../Redux/NoticeRedux'

export function * notice (api, {params}) {
  try {
    const res = yield call(api, params)
    if (res.success) {
      yield put(NoticeActions.noticeSuccess(res.data)) 
    } else {
      yield put(NoticeActions.noticeFailure(res.error))
    }
  } catch (error) {
    yield put(NoticeActions.noticeFailure(error.message))
  }
}
