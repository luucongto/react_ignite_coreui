
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  soldProductRequest: ['params'],
  soldProductSuccess: ['data'],
  soldProductFailure: ['error'],
  clearData: null
})

export const SoldProductTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: null,
  error: null,
  fetching: false,
})

/* ------------- Reducers ------------- */

export const soldProductRequest = state => state.merge({ fetching: true, error: null, data: null })

export const soldProductSuccess = (state, { data }) => state.merge({ fetching: false, error: null, data })

export const soldProductFailure = (state, { error }) => state.merge({ fetching: false, error, data: null })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SOLD_PRODUCT_REQUEST]: soldProductRequest,
  [Types.SOLD_PRODUCT_SUCCESS]: soldProductSuccess,
  [Types.SOLD_PRODUCT_FAILURE]: soldProductFailure
})
