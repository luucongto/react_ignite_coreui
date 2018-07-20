import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Helmet from 'react-helmet'
import Alert from 'react-s-alert'

import 'react-s-alert/dist/s-alert-default.css'
import 'react-s-alert/dist/s-alert-css-effects/slide.css'
// mandatory

// optional - you can choose the effect you want
import 'react-s-alert/dist/s-alert-css-effects/scale.css';
import 'react-s-alert/dist/s-alert-css-effects/bouncyflip.css';
import 'react-s-alert/dist/s-alert-css-effects/flip.css';
import 'react-s-alert/dist/s-alert-css-effects/genie.css';
import 'react-s-alert/dist/s-alert-css-effects/jelly.css';
import 'react-s-alert/dist/s-alert-css-effects/stackslide.css';
// Custom
import AppConfig from '../Config/AppConfig'
import Routes from './Routes'
import Wrapper from '../Components/Wrapper'
import NoMatch from '../Routes/NoMatch'

const AppNavigation = () => (
  <Router>
    <Wrapper>
      <Helmet
        defaultTitle={AppConfig.appName}
        titleTemplate={`${AppConfig.appName}  | %s`}
      />
      <Switch>
        {Routes.map((route, i) => <Route key={i} {...route} />)}
        <Route component={NoMatch} />
      </Switch>
      <Alert stack={{limit: 3}} />
    </Wrapper>
  </Router>
)

export default AppNavigation
