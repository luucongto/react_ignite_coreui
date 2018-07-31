
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  bidderRequest: ['params'],
  bidderSuccess: ['data'],
  bidderFailure: ['error'],
  clearData: null
})

export const BidderTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: null,
  error: null,
  fetching: false,
})

/* ------------- Reducers ------------- */

export const bidderRequest = state => state.merge({ fetching: true, error: null, data: null })

export const bidderSuccess = (state, { data }) => state.merge({ fetching: false, error: null, data })

export const bidderFailure = (state, { error }) => state.merge({ fetching: false, error, data: null })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.BIDDER_REQUEST]: bidderRequest,
  [Types.BIDDER_SUCCESS]: bidderSuccess,
  [Types.BIDDER_FAILURE]: bidderFailure
})
