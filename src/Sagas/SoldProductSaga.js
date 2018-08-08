import { call, put } from 'redux-saga/effects'
import  SoldProductActions from '../Redux/SoldProductRedux'

export function *  soldProduct (api, {params}) {
  try {
    const res = yield call(api, params)
    if (res.success) { 
      yield put(SoldProductActions.soldProductSuccess(res.data)) 
    } else {
      yield put(SoldProductActions.soldProductFailure(res.error))
    }
  } catch (error) {
    yield put(SoldProductActions.soldProductFailure(error.message))
  }
}
