import React, { Component } from 'react'
import { Badge, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink } from 'reactstrap'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { AppAsideToggler, AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler } from '@coreui/react'
import logo from '../../assets/img/brand/Punch_Logo.png'
import sygnet from '../../assets/img/brand/Punch_P_Logo.png'
import LoginActions from '../../../Redux/LoginRedux'
import SocketApi from '../../../Services/SocketApi'
import moment from 'moment'
const propTypes = {
  children: PropTypes.node
}

const defaultProps = {}

class DefaultHeader extends Component {
  constructor (props) {
    super(props)
    this.state = {
      serverTime: 0,
      isConnected: false
    }
    SocketApi.addListener('connect', () => this.setState({isConnected: true}))
    SocketApi.addListener('disconnect', () => this.setState({isConnected: false}))
    // SocketApi.addListener('server_setting', (data) => this.setState({serverTime: data.time}))
  }
  componentDidMount () {
    this.timeInterval = setInterval(() => this.forceUpdate(), 1000)
  }
  componentWillUnmount () {
    clearInterval(this.timeInterval)
  }
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
        <Nav navbar>
          <NavItem className='px-3'>
            <Badge color={this.state.isConnected ? 'success' : 'danger'} > <i className={this.state.isConnected ? 'fa fa-wifi' : 'fa fa-flash'} /> {this.state.isConnected ? '' : 'Server Disconnected'} </Badge>
            <Badge color='info' > {moment(SocketApi.serverTime * 1000).format('YYYY/MM/DD HH:mm:ss')}</Badge>
          </NavItem>
        </Nav>
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
