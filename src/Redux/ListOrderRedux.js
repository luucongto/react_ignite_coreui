import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  listOrderRequest: ['params'],
  listOrderSuccess: ['data'],
  listOrderFailure: ['error'],
  clearData: null,
})

export const ListOrderTypes = Types
export default Creators
export const ListOrderSelector = (state) => state.listOrder
/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: [],
  error: null,
  fetching: false,
})

/* ------------- Reducers ------------- */

export const listOrderRequest = (state) => state.merge({ fetching: true, error: null, data: null })

export const listOrderSuccess = (state, { data }) =>
  state.merge({ fetching: false, error: null, data: data })

export const listOrderFailure = (state, { error }) =>
  state.merge({ fetching: false, error, data: null })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LIST_ORDER_REQUEST]: listOrderRequest,
  [Types.LIST_ORDER_SUCCESS]: listOrderSuccess,
  [Types.LIST_ORDER_FAILURE]: listOrderFailure,
})
