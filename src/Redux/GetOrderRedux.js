import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getOrderRequest: ['params'],
  getOrderSuccess: ['data'],
  getOrderFailure: ['error'],
  clearData: null,
})

export const GetOrderTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: {},
  error: null,
  fetching: false,
})

/* ------------- Reducers ------------- */

export const getOrderRequest = (state) => state.merge({ fetching: true, error: null, data: null })

export const getOrderSuccess = (state, { data }) =>
  state.merge({ fetching: false, error: null, data: data })

export const getOrderFailure = (state, { error }) =>
  state.merge({ fetching: false, error, data: null })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_ORDER_REQUEST]: getOrderRequest,
  [Types.GET_ORDER_SUCCESS]: getOrderSuccess,
  [Types.GET_ORDER_FAILURE]: getOrderFailure,
})
