
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  autoBidRequest: ['params'],
  autoBidSuccess: ['data'],
  autoBidFailure: ['error'],
  clearData: null
})

export const AutoBidTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: {},
  error: null,
  fetching: false,
})

/* ------------- Reducers ------------- */

export const autoBidRequest = state => state.merge({ fetching: true, error: null, data: null })

export const autoBidSuccess = (state, { data }) => {
  data.forEach(element => {
    state = state.setIn(['data', element.product_id], element)
  })
  return state
}

export const autoBidFailure = (state, { error }) => state.merge({ fetching: false, error, data: null })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.AUTO_BID_REQUEST]: autoBidRequest,
  [Types.AUTO_BID_SUCCESS]: autoBidSuccess,
  [Types.AUTO_BID_FAILURE]: autoBidFailure
})
