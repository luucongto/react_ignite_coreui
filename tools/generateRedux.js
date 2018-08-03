var fs = require('fs')
var changeCase = require('change-case')
let name = process.argv[2].trim()
let temp = `
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  ${changeCase.camelCase(name)}Request: ['params'],
  ${changeCase.camelCase(name)}Success: ['data'],
  ${changeCase.camelCase(name)}Failure: ['error'],
  clearData: null
})

export const ${changeCase.pascalCase(name)}Types = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: null,
  error: null,
  fetching: false,
})

/* ------------- Reducers ------------- */

export const ${changeCase.camelCase(name)}Request = state => state.merge({ fetching: true, error: null, data: null })

export const ${changeCase.camelCase(name)}Success = (state, { data }) => state.merge({ fetching: false, error: null, data })

export const ${changeCase.camelCase(name)}Failure = (state, { error }) => state.merge({ fetching: false, error, data: null })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.${changeCase.snakeCase(name).toUpperCase()}_REQUEST]: ${changeCase.camelCase(name)}Request,
  [Types.${changeCase.snakeCase(name).toUpperCase()}_SUCCESS]: ${changeCase.camelCase(name)}Success,
  [Types.${changeCase.snakeCase(name).toUpperCase()}_FAILURE]: ${changeCase.camelCase(name)}Failure
})
`

let tempSaga =
`import { call, put } from 'redux-saga/effects'
import  ${changeCase.pascalCase(name)}Actions from '../Redux/ ${changeCase.pascalCase(name)}Redux'

export function *  ${changeCase.camelCase(name)} (api, {params}) {
  try {
    const res = yield call(api, params)
    if (res.success) { 
      yield put(${changeCase.pascalCase(name)}Actions.${changeCase.camelCase(name)}Success(res.data)) 
    } else {
      yield put(${changeCase.pascalCase(name)}Actions.${changeCase.camelCase(name)}Failure(res.error))
    }
  } catch (error) {
    yield put(${changeCase.pascalCase(name)}Actions.${changeCase.camelCase(name)}Failure(error.message))
  }
}
`
try {
  fs.writeFileSync(`./src/Redux/${changeCase.pascalCase(name)}Redux.js`, temp)
  fs.writeFileSync(`./src/Sagas/${changeCase.pascalCase(name)}Saga.js`, tempSaga)
  console.log(`DONE:`, `./src/Redux/${changeCase.pascalCase(name)}Redux.js`, `./src/Sagas/${changeCase.pascalCase(name)}Sagas.js`)
} catch (e) {
  console.log(e)
}
