import { call, put } from 'redux-saga/effects'
import AutoBidActions from '../Redux/AutoBidRedux'
import LoginActions from '../Redux/LoginRedux'
export function * autoBid (api, {params}) {
  try {
    const res = yield call(api, params)
    if (res === 'Unauthorized') {
      yield put(LoginActions.loginFailure())
      return
    }
    if (res.success) { 
      yield put(AutoBidActions.autoBidSuccess(res.data)) 
    } else {
      yield put(AutoBidActions.autoBidFailure(res.error))
    }
  } catch (error) {
    yield put(AutoBidActions.autoBidFailure(error.message))
  }
}
