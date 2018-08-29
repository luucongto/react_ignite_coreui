
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  productRequest: ['params'],
  productSuccess: ['data'],
  productFailure: ['error'],
  clearData: null
})

export const ProductTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: {},
  error: null,
  fetching: false
})

/* ------------- Reducers ------------- */

export const productRequest = state => state.merge({ fetching: true, error: null })

export const productSuccess = (state, { data }) => {
  data.forEach(element => {
    state = state.setIn(['data', element.id], element)
  })
  state = state.setIn(['fetching'], false)
  return state
}

export const productFailure = (state, { error }) => state.merge({ fetching: false, error })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.PRODUCT_REQUEST]: productRequest,
  [Types.PRODUCT_SUCCESS]: productSuccess,
  [Types.PRODUCT_FAILURE]: productFailure
})
