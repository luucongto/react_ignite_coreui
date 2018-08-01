import { call, put } from 'redux-saga/effects'
import BidderActions from '../Redux/ BidderRedux'

export function * bidder (api, {params}) {
  try {
    const res = yield call(api, params)
    if (res.success) {
      yield put(BidderActions.bidderSuccess(res.data))
    } else {
      yield put(BidderActions.bidderFailure(res.error))
    }
  } catch (error) {
    yield put(BidderActions.bidderFailure(error.message))
  }
}
