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
import navigation from '../../_nav'
// routes config
import routes from '../../routes'
import DefaultAside from './DefaultAside'
import DefaultFooter from './DefaultFooter'
import DefaultHeader from './DefaultHeader'
import PrivateRoute from '../../../Navigation/PrivateRoute'

class DefaultLayout extends Component {
  constructor (props) {
    super(props)
    let items = this._getSideNav(props)
    this.state = {
      navigation: {items}
    }
  }
  _getSideNav (props) {
    let items = navigation.items
    if (props.user && props.user.isSeller) {
      items = navigation.items.concat([
        {
          title: true,
          name: 'Seller House',
          wrapper: {
            element: '',
            attributes: {}
          }
        },
        {
          name: 'Selling Products',
          url: '/seller/manage',
          icon: 'icon-calculator'
        },
        {
          name: 'Overral',
          url: '/seller/sold',
          icon: 'icon-pie-chart'
        }
      ])
    }
    return items
  }
  componentWillReceiveProps (props) {
    console.log('componentWillReceiveProps', props)
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
          <AppSidebar minimized display='lg'>
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
                <Redirect from='/' to='/trade' />
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

export default connect(mapStateToProps, mapDispatchToProps)(DefaultLayout)
