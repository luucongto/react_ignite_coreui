import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  apiSettingRequest: ['params'],
  apiSettingSuccess: ['data'],
  apiSettingFailure: ['error'],
  clearData: null
})

export const ApiSettingTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: null,
  error: null,
  fetching: false,
})

/* ------------- Reducers ------------- */

export const apiSettingRequest = state => state.merge({ fetching: true, error: null, data: null })

export const apiSettingSuccess = (state, { data }) => state.merge({ fetching: false, error: null, data })

export const apiSettingFailure = (state, { error }) => state.merge({ fetching: false, error, data: null })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.API_SETTING_REQUEST]: apiSettingRequest,
  [Types.API_SETTING_SUCCESS]: apiSettingSuccess,
  [Types.API_SETTING_FAILURE]: apiSettingFailure
})
