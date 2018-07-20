import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  autoOrdersRequest: ['params'],
  autoOrdersSuccess: ['data'],
  autoOrdersFailure: ['error'],
  clearData: null
})

export const AutoOrdersTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: [],
  error: null,
  fetching: false
})

/* ------------- Reducers ------------- */

export const autoOrdersRequest = state => state.merge({ fetching: true, error: null })

export const autoOrdersSuccess = (state, { data }) => {
  let updatedIds = data.map(e => e.id)
  let unchanges = state.data.filter(e => updatedIds.indexOf(e.id) < 0)
  let updated = [...unchanges, ...data]
  return state.merge({ fetching: false, error: null, data: updated })
}

export const autoOrdersFailure = (state, { error }) => state.merge({ fetching: false, error })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.AUTO_ORDERS_REQUEST]: autoOrdersRequest,
  [Types.AUTO_ORDERS_SUCCESS]: autoOrdersSuccess,
  [Types.AUTO_ORDERS_FAILURE]: autoOrdersFailure
})
