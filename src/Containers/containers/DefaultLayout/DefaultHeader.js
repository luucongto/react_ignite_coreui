import React, { Component } from 'react'
import { Badge, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink } from 'reactstrap'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { AppAsideToggler, AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler } from '@coreui/react'
import logo from '../../assets/img/brand/logo.svg'
import sygnet from '../../assets/img/brand/square_logo.png'
import LoginActions from '../../../Redux/LoginRedux'
import moment from 'moment'
import Alert from 'react-s-alert'
import {translate} from 'react-i18next'
const propTypes = {
  children: PropTypes.node
}

const defaultProps = {}

class DefaultHeader extends Component {
  logout () {
    this.props.logout()
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
          full={{ src: logo, width: 89, height: 34, alt: 'Logo' }}
          minimized={{ src: sygnet, width: 30, height: 30, alt: 'Logo' }}
        />
        <AppSidebarToggler className='d-md-down-none' display='lg' />
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
    user: state.login.data
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: (username, password) => dispatch(LoginActions.logoutRequest())
  }
}

export default translate('translations')(connect(mapStateToProps, mapDispatchToProps)(DefaultHeader))
