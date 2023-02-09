import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  forgotPasswordRequest: ['params'],
  forgotPasswordSuccess: ['data'],
  forgotPasswordFailure: ['error'],
  clearData: null,
})

export const ForgotPasswordTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: {},
  error: null,
  fetching: false,
})

/* ------------- Reducers ------------- */

export const forgotPasswordRequest = (state) =>
  state.merge({ fetching: true, error: null, data: null })

export const forgotPasswordSuccess = (state, { data }) =>
  state.merge({ fetching: false, error: null, data: data })

export const forgotPasswordFailure = (state, { error }) =>
  state.merge({ fetching: false, error, data: null })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.FORGOT_PASSWORD_REQUEST]: forgotPasswordRequest,
  [Types.FORGOT_PASSWORD_SUCCESS]: forgotPasswordSuccess,
  [Types.FORGOT_PASSWORD_FAILURE]: forgotPasswordFailure,
})
