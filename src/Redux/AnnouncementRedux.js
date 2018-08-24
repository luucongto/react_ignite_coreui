
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  announcementRequest: ['params'],
  announcementSuccess: ['data'],
  announcementFailure: ['error'],
  clearData: null
})

export const AnnouncementTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data:{},
  error: null,
  fetching: false,
})

/* ------------- Reducers ------------- */

export const announcementRequest = state => state.merge({ fetching: true, error: null, data: {} })

export const announcementSuccess = (state, { data }) => {
  data.forEach(element => {
    state = state.setIn(['data', element.id], element)
  })

  return state
}

export const announcementFailure = (state, { error }) => state.merge({ fetching: false, error, data: {} })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.ANNOUNCEMENT_REQUEST]: announcementRequest,
  [Types.ANNOUNCEMENT_SUCCESS]: announcementSuccess,
  [Types.ANNOUNCEMENT_FAILURE]: announcementFailure
})
