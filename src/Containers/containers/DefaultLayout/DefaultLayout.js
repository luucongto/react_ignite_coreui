import React, { Component } from 'react'
import { Redirect, Switch } from 'react-router-dom'
import { Container } from 'reactstrap'
import { connect } from 'react-redux'

import {
  AppAside,
  AppBreadcrumb,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav
} from '@coreui/react'
// sidebar nav config
// routes config
import routes from '../../routes'
import DefaultAside from './DefaultAside'
import DefaultFooter from './DefaultFooter'
import DefaultHeader from './DefaultHeader'
import PrivateRoute from '../../../Navigation/PrivateRoute'
import {translate} from 'react-i18next'

class DefaultLayout extends Component {
  constructor (props) {
    super(props)
    let items = this._getSideNav(props)
    this.state = {
      navigation: {items}
    }
    let self = this
    this.props.i18n.on('languageChanged', function (lng) {
      self.setState({navigation: {items: self._getSideNav(self.props)}})
    })
  }
  _getSideNav (props) {
    const i18n = this.props.i18n
    let items = [{
      name: i18n.t('notices'),
      url: '/notices',
      icon: 'icon-speedometer',
      badge: {
        variant: 'info',
        text: 'NEW'
      }
    },
    {
      title: true,
      name: i18n.t('account'),
      wrapper: { // optional wrapper object
        element: '', // required valid HTML5 element tag
        attributes: {} // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: '' // optional class names space delimited list for title item ex: "text-center"
    },
    {
      name: i18n.t('info'),
      url: '/accountInfo',
      icon: 'icon-pencil'
    }
    ]
    return items
  }
  componentWillReceiveProps (props) {
    if (props.user && props.user.isAdmin) {
      let items = this._getSideNav(props)
      this.setState({navigation: {items}})
    }
  }
  render () {
    return (
      <div className='app'>
        <AppHeader fixed>
          <DefaultHeader />
        </AppHeader>
        <div className='app-body'>
          <AppSidebar fixed display='lg'>
            <AppSidebarHeader />
            <AppSidebarForm />
            <AppSidebarNav navConfig={this.state.navigation} {...this.props} />
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className='main'>
            <AppBreadcrumb appRoutes={routes} />
            <Container fluid style={{backgroundColor: 'white'}}>
              <Switch>
                {routes.map((route, idx) => {
                  return route.component ? (<PrivateRoute key={idx} {...route} />) : (null)
                }
                )}
                <Redirect from='/' to='/dashboard' />
              </Switch>
            </Container>
          </main>
          <AppAside fixed hidden>
            <DefaultAside />
          </AppAside>
        </div>
        <AppFooter>
          <DefaultFooter />
        </AppFooter>
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.login.data
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default translate('translations')(connect(mapStateToProps, mapDispatchToProps)(DefaultLayout))
