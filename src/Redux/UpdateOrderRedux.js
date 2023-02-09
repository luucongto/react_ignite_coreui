import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  updateOrderRequest: ['params'],
  updateOrderSuccess: ['data'],
  updateOrderFailure: ['error'],
  clearData: null,
})

export const UpdateOrderTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: {},
  error: null,
  fetching: false,
})

/* ------------- Reducers ------------- */

export const updateOrderRequest = (state) =>
  state.merge({ fetching: true, error: null, data: null })

export const updateOrderSuccess = (state, { data }) =>
  state.merge({ fetching: false, error: null, data: data })

export const updateOrderFailure = (state, { error }) =>
  state.merge({ fetching: false, error, data: null })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.UPDATE_ORDER_REQUEST]: updateOrderRequest,
  [Types.UPDATE_ORDER_SUCCESS]: updateOrderSuccess,
  [Types.UPDATE_ORDER_FAILURE]: updateOrderFailure,
})
