import 'react-app-polyfill/stable'
import 'core-js'
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { Provider } from 'react-redux'
import reduxStore from './Redux'
import { PersistGate } from 'redux-persist/es/integration/react'

const { persistor, store } = reduxStore()
const onBeforeLift = () => {
  // take some action before the gate lifts
}
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={<h3>Loading...</h3>} onBeforeLift={onBeforeLift} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
