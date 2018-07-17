import React, { Component } from 'react'
import { connect } from 'react-redux'
import AppNavigation from '../Navigation/AppNavigation'
import './scss/style.css'
class RootContainer extends Component {
  render () {
    return <AppNavigation />
  }
}

export default connect(null, null)(RootContainer)
