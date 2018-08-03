
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  noticeRequest: ['params'],
  noticeSuccess: ['data'],
  noticeFailure: ['error'],
  clearData: null
})

export const NoticeTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: [],
  error: null,
  fetching: false,
})

/* ------------- Reducers ------------- */

export const noticeRequest = state => state.merge({ fetching: true, error: null, data: null })

export const noticeSuccess = (state, { data }) => state.merge({ fetching: false, error: null, data })

export const noticeFailure = (state, { error }) => state.merge({ fetching: false, error, data: null })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.NOTICE_REQUEST]: noticeRequest,
  [Types.NOTICE_SUCCESS]: noticeSuccess,
  [Types.NOTICE_FAILURE]: noticeFailure
})
