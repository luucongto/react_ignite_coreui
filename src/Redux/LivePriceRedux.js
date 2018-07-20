import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  livePriceRequest: null,
  livePriceSuccess: ['data'],
  livePriceFailure: ['error'],
  clearData: null
})

export const LivePriceTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: [],
  error: null,
  fetching: false,
})

/* ------------- Reducers ------------- */

export const livePriceRequest = state => state.merge({ fetching: true, error: null, data: null })

export const livePriceSuccess = (state, { data }) => state.merge({ fetching: false, error: null, data })

export const livePriceFailure = (state, { error }) => state.merge({ fetching: false, error, data: null })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LIVE_PRICE_REQUEST]: livePriceRequest,
  [Types.LIVE_PRICE_SUCCESS]: livePriceSuccess,
  [Types.LIVE_PRICE_FAILURE]: livePriceFailure
})
