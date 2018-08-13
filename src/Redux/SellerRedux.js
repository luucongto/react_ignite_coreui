
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  sellerRequest: ['params'],
  sellerSuccess: ['data'],
  sellerFailure: ['error'],
  clearData: null
})

export const SellerTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: null,
  error: null,
  fetching: false,
})

/* ------------- Reducers ------------- */

export const sellerRequest = state => state.merge({ fetching: true, error: null, data: null })

export const sellerSuccess = (state, { data }) => state.merge({ fetching: false, error: null, data })

export const sellerFailure = (state, { error }) => state.merge({ fetching: false, error, data: null })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SELLER_REQUEST]: sellerRequest,
  [Types.SELLER_SUCCESS]: sellerSuccess,
  [Types.SELLER_FAILURE]: sellerFailure
})
