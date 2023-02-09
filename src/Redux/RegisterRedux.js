import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  registerRequest: ['params'],
  registerSuccess: ['data'],
  registerFailure: ['error'],
  clearData: null,
})

export const RegisterTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: {},
  error: null,
  fetching: false,
})

/* ------------- Reducers ------------- */

export const registerRequest = (state) => state.merge({ fetching: true, error: null, data: null })

export const registerSuccess = (state, { data }) =>
  state.merge({ fetching: false, error: null, data: data })

export const registerFailure = (state, { error }) =>
  state.merge({ fetching: false, error, data: null })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.REGISTER_REQUEST]: registerRequest,
  [Types.REGISTER_SUCCESS]: registerSuccess,
  [Types.REGISTER_FAILURE]: registerFailure,
})
