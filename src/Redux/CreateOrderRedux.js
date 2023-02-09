import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  createOrderRequest: ['params'],
  createOrderSuccess: ['data'],
  createOrderFailure: ['error'],
  clearData: null,
})

export const CreateOrderTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: {},
  error: null,
  fetching: false,
})

/* ------------- Reducers ------------- */

export const createOrderRequest = (state) =>
  state.merge({ fetching: true, error: null, data: null })

export const createOrderSuccess = (state, { data }) =>
  state.merge({ fetching: false, error: null, data: data })

export const createOrderFailure = (state, { error }) =>
  state.merge({ fetching: false, error, data: null })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.CREATE_ORDER_REQUEST]: createOrderRequest,
  [Types.CREATE_ORDER_SUCCESS]: createOrderSuccess,
  [Types.CREATE_ORDER_FAILURE]: createOrderFailure,
})
