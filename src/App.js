import React, { Component, Suspense } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import './scss/style.scss'
import '/node_modules/flag-icons/css/flag-icons.min.css'
import 'react-s-alert/dist/s-alert-default.css'
import 'react-s-alert/dist/s-alert-css-effects/slide.css'
// mandatory

// optional - you can choose the effect you want
import 'react-s-alert/dist/s-alert-css-effects/scale.css'
import 'react-s-alert/dist/s-alert-css-effects/bouncyflip.css'
import 'react-s-alert/dist/s-alert-css-effects/flip.css'
import 'react-s-alert/dist/s-alert-css-effects/genie.css'
import 'react-s-alert/dist/s-alert-css-effects/jelly.css'
import 'react-s-alert/dist/s-alert-css-effects/stackslide.css'
import Alert from 'react-s-alert'
import LandingPage from './views/pages/LandingPage/LandingPage'
const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

class App extends Component {
  render() {
    return (
      <HashRouter>
        <Suspense fallback={loading}>
          <Routes>
            <Route exact path="/login" name="Login Page" element={<Login />} />
            <Route exact path="/register" name="Register Page" element={<Register />} />
            <Route exact path="/404" name="Page 404" element={<Page404 />} />
            <Route exact path="/500" name="Page 500" element={<Page500 />} />
            <Route exact path="/" name="Landing" element={<LandingPage />} />
            <Route path="/home/*" name="Home" element={<DefaultLayout />} />
          </Routes>
        </Suspense>
        <Alert stack={{ limit: 3 }} />
      </HashRouter>
    )
  }
}

export default App
