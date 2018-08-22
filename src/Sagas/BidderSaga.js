import { call, put } from 'redux-saga/effects'
import BidderActions from '../Redux/ BidderRedux'
import LoginActions from '../Redux/LoginRedux'
export function * bidder (api, {params}) {
  try {
    const res = yield call(api, params)
    if (res === 'Unauthorized') {
      yield put(LoginActions.loginFailure())
      return
    }
    if (res.success) {
      yield put(BidderActions.bidderSuccess(res.data))
    } else {
      yield put(BidderActions.bidderFailure(res.error))
    }
  } catch (error) {
    yield put(BidderActions.bidderFailure(error.message))
  }
}
