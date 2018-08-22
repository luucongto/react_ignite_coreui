import { call, put } from 'redux-saga/effects'
import ServerSettingActions from '../Redux/ServerSettingRedux'
import LoginActions from '../Redux/LoginRedux'
export function * serverSetting (api, {params}) {
  try {
    const res = yield call(api, params)
    if (res === 'Unauthorized') {
      yield put(LoginActions.loginFailure())
      return
    }
    if (res.success) {
      yield put(ServerSettingActions.serverSettingSuccess(res.data))
    } else {
      yield put(ServerSettingActions.serverSettingFailure(res.error))
    }
  } catch (error) {
    yield put(ServerSettingActions.serverSettingFailure(error.message))
  }
}
