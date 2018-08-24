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
import AutoBidActions from '../../../Redux/AutoBidRedux'
import SocketApi from '../../../Services/SocketApi'
import moment from 'moment'
import Alert from 'react-s-alert'
import {translate} from 'react-i18next'
import ChatWidget from '../../views/Chat/ChatWidget'
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
    this._displayServerMessage = this._displayServerMessage.bind(this)
    // SocketApi.addListener('server_setting', (data) => this.setState({serverTime: data.time}))
  }
  componentDidMount () {
    this.timeInterval = setInterval(() => this.forceUpdate(), 1000)
    this._setupSocket()
  }
  componentWillUnmount () {
    clearInterval(this.timeInterval)
    SocketApi.removeAllListener('server_message')
    SocketApi.removeAllListener('auction')
    SocketApi.removeAllListener('users')
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
    console.log('Setup socket')
    SocketApi.on('auction', data => {
      self.props.updateProducts(data)
    })
    SocketApi.on('users', data => {
      self.props.updateBidders(data)
    })
    SocketApi.on('autoBids', data => {
      self.props.updateAutoBids(data)
    })
    SocketApi.on('server_message', this._displayServerMessage)
    this.refresh()
  }
  _displayServerMessage (data) {
    if (data.msg === 'Please relogin. Your token is expired!!') {
      this.props.logout()
    }
    if (data.type === 'error') {
      Alert.error(this.props.t(data.msg, data.msgParams), {
        position: 'bottom-right',
        effect: 'bouncyflip'
      })
    } else if (data.type === 'info') {
        // Alert.info(data.msg, {
        //   position: 'bottom-right',
        //   effect: 'bouncyflip'
        // })
    }
  }
  render () {
    let langs = {
      'en': {
        code: 'en', icon: 'us', name: 'English'
      },
      'vi': {
        code: 'vi', icon: 'vn', name: 'Tiếng Việt'
      }}
    // eslint-disable-next-line
    const { children, ...attributes } = this.props;
    let lang = 'en'
    if (this.props.i18n.language === 'vi') {
      lang = 'vi'
    }
    return (
      <React.Fragment>
        <AppSidebarToggler className='d-lg-none' display='md' mobile />
        <AppNavbarBrand
          full={{ src: logo, width: 89, height: 34, alt: 'Punch Logo' }}
          minimized={{ src: sygnet, width: 30, height: 30, alt: 'Punch Logo' }}
        />
        <AppSidebarToggler className='d-md-down-none' display='lg' />
        <Nav navbar className='d-md-down-none'>
          <NavItem className='px-3'>
            <Badge color={this.state.isConnected ? 'success' : 'danger'} > <i className={this.state.isConnected ? 'fa fa-wifi' : 'fa fa-flash'} /> {this.state.isConnected ? SocketApi.onlineClients : this.props.t('server_disconnected')} </Badge>
            <Badge color='info' > {moment(SocketApi.serverTime * 1000).format('YYYY/MM/DD HH:mm:ss')}</Badge>

          </NavItem>
        </Nav>
        {this.props.user && this.props.user.isAdmin ? (<Nav navbar className='d-md-down-none'>
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
              <DropdownItem onClick={() => this.logout()}><i className='fa fa-lock' />{this.props.t('logout')}</DropdownItem>
            </DropdownMenu>
          </AppHeaderDropdown>
        </Nav>
        <Nav className='ml-1' navbar>
          <AppHeaderDropdown direction='down'>
            <DropdownToggle nav className='px-3'>
              <strong><i className={`flag-icon flag-icon-${langs[lang].icon}`} /></strong>
            </DropdownToggle>
            <DropdownMenu right style={{ right: 'auto' }}>
              {Object.values(langs).map(lang => <DropdownItem key={lang.code} onClick={() => this.props.i18n.changeLanguage(lang.code)}><i className={`flag-icon flag-icon-${lang.icon}`} />{lang.name}</DropdownItem>)}
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
    updateAutoBids: (bids) => dispatch(AutoBidActions.autoBidSuccess(bids)),
    updateProducts: (products) => dispatch(ProductAction.productSuccess(products))
  }
}

export default translate('translations')(connect(mapStateToProps, mapDispatchToProps)(DefaultHeader))
