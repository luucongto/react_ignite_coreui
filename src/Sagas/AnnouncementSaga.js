import { call, put } from 'redux-saga/effects'
import AnnouncementActions from '../Redux/AnnouncementRedux'
import LoginActions from '../Redux/LoginRedux'
export function * announcement (api, {params}) {
  try {
    const res = yield call(api, params)
    if (res === 'Unauthorized') {
      yield put(LoginActions.loginFailure())
      return
    }
    if (res.success) { 
      yield put(AnnouncementActions.announcementSuccess(res.data)) 
    } else {
      yield put(AnnouncementActions.announcementFailure(res.error))
    }
  } catch (error) {
    yield put(AnnouncementActions.announcementFailure(error.message))
  }
}
