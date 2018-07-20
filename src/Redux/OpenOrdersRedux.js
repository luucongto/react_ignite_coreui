import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  openOrdersRequest: ['params'],
  openOrdersSuccess: ['data'],
  openOrdersFailure: ['error'],
  clearData: null
})

export const OpenOrdersTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: [],
  error: null,
  fetching: false
})

/* ------------- Reducers ------------- */

export const openOrdersRequest = state => state.merge({ fetching: true, error: null })

export const openOrdersSuccess = (state, { data }) => {
  let updatedIds = data.map(e => e.id)
  let unchanges = state.data.filter(e => updatedIds.indexOf(e.id) < 0)
  let updated = [...unchanges, ...data]
  return state.merge({ fetching: false, error: null, data: updated })
}

export const openOrdersFailure = (state, { error }) => state.merge({ fetching: false, error })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.OPEN_ORDERS_REQUEST]: openOrdersRequest,
  [Types.OPEN_ORDERS_SUCCESS]: openOrdersSuccess,
  [Types.OPEN_ORDERS_FAILURE]: openOrdersFailure
})
