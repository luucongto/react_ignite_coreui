import { call, put } from 'redux-saga/effects'
import SellerActions from '../Redux/SellerRedux'

export function * seller (api, {params}) {
  try {
    const res = yield call(api, params)
    if (res.success) {
      yield put(SellerActions.sellerSuccess(res.data))
    } else {
      yield put(SellerActions.sellerFailure(res.error))
    }
  } catch (error) {
    yield put(SellerActions.sellerFailure(error.message))
  }
}
