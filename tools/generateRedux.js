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
  data: {},
  error: null,
  fetching: false
})

/* ------------- Reducers ------------- */

export const ${changeCase.camelCase(name)}Request = state => state.merge({ fetching: true, error: null, data: null })

export const ${changeCase.camelCase(name)}Success = (state, { data }) => {
  data.forEach(element => {
    if (element.option && element.option === 'delete') {
      let newData = Object.assign({}, state.data)
      delete newData[element.id]
      state = state.setIn(['data'], newData)
    } else {
      state = state.setIn(['data', element.id], element)
    }
  })
  state = state.setIn(['fetching'], false)
  return state
}

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
import ${changeCase.pascalCase(name)}Actions from '../Redux/${changeCase.pascalCase(name)}Redux'
import LoginActions from '../Redux/LoginRedux'
export function * ${changeCase.camelCase(name)} (api, {params}) {
  try {
    const res = yield call(api, params)
    if (res === 'Unauthorized') {
      yield put(LoginActions.loginFailure())
      return
    }
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

// insert into index.saga
const readline = require('readline')
let appendSagas = () => {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: fs.createReadStream('./src/Sagas/index.js'),
      crlfDelay: Infinity
    })
    const TypesLine = '/* ------------- Types ------------- */'
    const SagasLine = '/* ------------- Sagas ------------- */'
    let connect = '// tool generated sagas'
    let newFileStrs = []
    let inserted = false
    rl.on('line', (line) => {
      if (line === TypesLine) {
        inserted = true
        newFileStrs.push(line)
        newFileStrs.push(`import { ${changeCase.pascalCase(name)}Types } from '../Redux/${changeCase.pascalCase(name)}Redux'`)
      } else if (line === SagasLine) {
        newFileStrs.push(line)
        inserted = true
        newFileStrs.push(`import { ${changeCase.camelCase(name)} } from './${changeCase.pascalCase(name)}Saga'`)
      } else if (line.trim() === connect) {
        newFileStrs.push(line)
        inserted = true
        newFileStrs.push(`    takeLatest(${changeCase.pascalCase(name)}Types.${changeCase.snakeCase(name).toUpperCase()}_REQUEST, ${changeCase.camelCase(name)}, api.${changeCase.camelCase(name)}),`)
      } else {
        newFileStrs.push(line)
      }
    })
    rl.on('close', function () {
      resolve({
        success: inserted,
        newFileStrs
      })
    })
  })
}

let appendReducers = () => {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: fs.createReadStream('./src/Redux/index.js'),
      crlfDelay: Infinity
    })
    const reducerLine = 'const appReducer = combineReducers({'
    let newFileStrs = []
    let inserted = false
    rl.on('line', (line) => {
      if (line.trim() === reducerLine) {
        newFileStrs.push(line)
        inserted = true
        newFileStrs.push(`    ${changeCase.camelCase(name)}: require('./${changeCase.pascalCase(name)}Redux').reducer,`)
      } else {
        newFileStrs.push(line)
      }
    })
    rl.on('close', function () {
      resolve({
        success: inserted,
        newFileStrs
      })
    })
  })
}

try {
  appendReducers().then(reducers => {
    if (reducers.success) {
      fs.writeFileSync(`./src/Redux/index.js`, reducers.newFileStrs.join('\n') + '\n')
    }
  })
  appendSagas().then(sagas => {
    if (sagas.success) {
      fs.writeFileSync(`./src/Sagas/index.js`, sagas.newFileStrs.join('\n') + '\n')
    }
  })
  fs.writeFileSync(`./src/Redux/${changeCase.pascalCase(name)}Redux.js`, temp)
  fs.writeFileSync(`./src/Sagas/${changeCase.pascalCase(name)}Saga.js`, tempSaga)
  console.log(`DONE:`, `./src/Redux/${changeCase.pascalCase(name)}Redux.js`, `./src/Sagas/${changeCase.pascalCase(name)}Sagas.js`)
} catch (e) {
  console.log(e)
}
