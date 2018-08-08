import React, { Component } from 'react'
import { Badge, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink } from 'reactstrap'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { AppAsideToggler, AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler } from '@coreui/react'
import logo from '../../assets/img/brand/Punch_Logo.png'
import sygnet from '../../assets/img/brand/Punch_P_Logo.png'
import LoginActions from '../../../Redux/LoginRedux'
import ProductAction from '../../../Redux/ProductRedux'
import BidderAction from '../../../Redux/BidderRedux'
import SocketApi from '../../../Services/SocketApi'
import moment from 'moment'
import Alert from 'react-s-alert'
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
    this._setupSocket()
  }
  componentWillUnmount () {
    clearInterval(this.timeInterval)
  }
  logout () {
    this.props.logout()
  }
  refresh () {
    SocketApi.emit('auction', {
      command: 'refresh'
    })
  }
  _setupSocket () {
    let self = this
    console.log("Setup socket")
    SocketApi.on('auction', data => {
      self.props.updateProducts(data)
    })
    SocketApi.on('users', data => {
      self.props.updateBidders(data)
    })
    SocketApi.on('server_message', data => {
      console.log('server_message', data)
      if (data.type === 'error') {
        Alert.error(data.msg, {
          position: 'bottom-right',
          effect: 'bouncyflip'
        })
      } else if (data.type === 'info') {
        // Alert.info(data.msg, {
        //   position: 'bottom-right',
        //   effect: 'bouncyflip'
        // })
      }
    })
    this.refresh()
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
        <Nav navbar className="d-md-down-none">
          <NavItem className='px-3'>
            <Badge color={this.state.isConnected ? 'success' : 'danger'} > <i className={this.state.isConnected ? 'fa fa-wifi' : 'fa fa-flash'} /> {this.state.isConnected ? SocketApi.onlineClients : 'Server Disconnected'} </Badge>
            <Badge color='info' > {moment(SocketApi.serverTime * 1000).format('YYYY/MM/DD HH:mm:ss')}</Badge>

          </NavItem>
        </Nav>
        {this.props.user && this.props.user.isAdmin ? (<Nav navbar className="d-md-down-none">
          <NavItem className='px-3'>
            <NavLink href='/admin'>Admin</NavLink>
          </NavItem>
        </Nav>) : ('')}
        <Nav className='ml-auto' navbar>
          <AppHeaderDropdown direction='down'>
            <DropdownToggle nav className='px-3'>
            <strong><img src={this.props.user ? this.props.user.image_url : sygnet} className='bidder_avatar' /> {this.props.user ? this.props.user.name : ''} </strong>
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
    user: state.login.data,
    products: state.product.data
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: (username, password) => dispatch(LoginActions.logoutRequest()),
    updateBidders: (bidders) => dispatch(BidderAction.bidderSuccess(bidders)),
    updateProducts: (products) => dispatch(ProductAction.productSuccess(products))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DefaultHeader)
