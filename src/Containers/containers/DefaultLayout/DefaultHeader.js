import React, { Component } from 'react'
import { Badge, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink } from 'reactstrap'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { AppAsideToggler, AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler } from '@coreui/react'
import logo from '../../assets/img/brand/Punch_Logo.png'
import sygnet from '../../assets/img/brand/Punch_P_Logo.png'
import LoginActions from '../../../Redux/LoginRedux'

const propTypes = {
  children: PropTypes.node
}

const defaultProps = {}

class DefaultHeader extends Component {
  logout () {
    this.props.logout()
  }
  render () {
    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <AppSidebarToggler className='d-lg-none' display='md' mobile />
        <AppNavbarBrand
          full={{ src: logo, width: 89, height: 34, alt: 'Punch Logo' }}
          minimized={{ src: sygnet, width: 30, height: 30, alt: 'Punch Logo' }}
        />
        <AppSidebarToggler className='d-md-down-none' display='lg' />

        <Nav className='ml-auto' navbar>
          <NavItem className='px-3'>
            <strong> Welcome, {this.props.user ? this.props.user.name : ''} </strong>
          </NavItem>
          <AppHeaderDropdown direction='down'>
            <DropdownToggle nav>
              <i className='fa fa-bars' />
            </DropdownToggle>
            <DropdownMenu right style={{ right: 'auto' }}>
              <DropdownItem onClick={() => this.logout()}><i className='fa fa-lock' /> Logout</DropdownItem>
            </DropdownMenu>
          </AppHeaderDropdown>
        </Nav>
        {/* <AppAsideToggler className='d-md-down-none' /> */}
        {/* <AppAsideToggler className="d-lg-none" mobile /> */}
      </React.Fragment>
    )
  }
}

DefaultHeader.propTypes = propTypes
DefaultHeader.defaultProps = defaultProps

const mapStateToProps = (state) => {
  return {
    user: state.login.data
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: (username, password) => dispatch(LoginActions.logoutRequest())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DefaultHeader)
