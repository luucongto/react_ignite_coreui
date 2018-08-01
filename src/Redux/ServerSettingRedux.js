
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  serverSettingRequest: ['params'],
  serverSettingSuccess: ['data'],
  serverSettingFailure: ['error'],
  clearData: null
})

export const ServerSettingTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: null,
  error: null,
  fetching: false
})

/* ------------- Reducers ------------- */

export const serverSettingRequest = state => state.merge({ fetching: true, error: null, data: null })

export const serverSettingSuccess = (state, { data }) => state.merge({ fetching: false, error: null, data })

export const serverSettingFailure = (state, { error }) => state.merge({ fetching: false, error, data: null })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SERVER_SETTING_REQUEST]: serverSettingRequest,
  [Types.SERVER_SETTING_SUCCESS]: serverSettingSuccess,
  [Types.SERVER_SETTING_FAILURE]: serverSettingFailure
})
