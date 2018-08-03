
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  localLikeRequest: ['params'],
  localLikeSuccess: ['data'],
  localLikeFailure: ['error'],
  clearData: null
})

export const LocalLikeTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: [],
  error: null,
  fetching: false,
})

/* ------------- Reducers ------------- */

export const localLikeRequest = state => state.merge({ fetching: true, error: null, data: null })

export const localLikeSuccess = (state, { data }) => state.merge({ fetching: false, error: null, data })

export const localLikeFailure = (state, { error }) => state.merge({ fetching: false, error, data: null })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LOCAL_LIKE_REQUEST]: localLikeRequest,
  [Types.LOCAL_LIKE_SUCCESS]: localLikeSuccess,
  [Types.LOCAL_LIKE_FAILURE]: localLikeFailure
})
