import { call, put } from 'redux-saga/effects'
import OpenOrdersActions from '../Redux/OpenOrdersRedux'

export function * openOrders (api, {params}) {
  try {
    const res = yield call(api, params)
    if (res.success) {
      yield put(OpenOrdersActions.openOrdersSuccess(res.data))
    } else yield put(OpenOrdersActions.openOrdersFailure(res.error))
  } catch (error) {
    yield put(OpenOrdersActions.openOrdersFailure(error.message))
  }
}
