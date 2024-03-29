import React, { Component } from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { Button, Card, CardBody, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Progress, Row } from 'reactstrap'
import LoginActions from '../../../../Redux/LoginRedux'
import logo from '../../../assets/img/brand/logo.svg'
import sygnet from '../../../assets/img/brand/sygnet.svg'
import Alert from 'react-s-alert'
class Login extends Component {
  constructor (props) {
    super(props)
    this.state = {
      fetching: false,
      username: '',
      password: '',
      isAuthenticated: false,
      user: null,
      token: ''
    }
    this.googleResponse = this.googleResponse.bind(this)
    this.logout = this.logout.bind(this)
    this._handleKeyPress = this._handleKeyPress.bind(this)
  }

  _handleKeyPress (e) {
    if (e.key === 'Enter') {
      this._login()
    }
  }
  componentWillReceiveProps (props) {
    if (props.user) {
      this.setState({fetching: false})
      this.props.history.push('/dashboard')
    }
    if (props.error) {
      console.log(props.error)
      this.setState({fetching: false})
      // Alert.error(this.props.t(props.error), {
        // position: 'bottom-right',
        // effect: 'bouncyflip'
      // })
    }
  }
  logout () {
    this.setState({isAuthenticated: false, token: '', user: null})
  }
  googleResponse (response) {
    if (response.accessToken) {
      const tokenBlob = new Blob([JSON.stringify({access_token: response.accessToken}, null, 2)], {type: 'application/json'})
      // let params = {
      //   accessToken : response.accessToken,
      //   profileObj: response.profileObj
      // }
      this.props.login({
        type: 'google',
        tokenBlob: tokenBlob
      })
    }
  }
  _login () {
    this.setState({fetching: true})
    this.props.login({
      type: 'local',
      username: this.state.username,
      email: this.state.username,
      password: this.state.password
    })
  }

  render () {
    return (
      <div className='app flex-row align-items-center animated fadeIn'>
        <Container>
          <Row className='justify-content-center mb-3'>
            <Col md='6' className='just-center text-center'>
              {/* <AppNavbarBrand
                full={{ src: sygnet, width: 300, height: 300, alt: 'Logo' }} /> */}
              {window.innerWidth < 700
                ? <img src={sygnet} width='200' height='200' alt='Logo' />
              : <img src={logo} width='500' height='200' alt='Logo' />
              }
            </Col>
          </Row>
          <Row className='justify-content-center'>
            {
              this.state.fetching ? (<Progress value='100' color='success' animated />)
            : <Col md='6'>
              <Card className='p-4'>
                <CardBody>
                  <h1>{this.props.t('login')}</h1>
                  <p className='text-muted'>{this.props.t('Sign In to your account')}</p>
                  <InputGroup className='mb-3'>
                    <InputGroupAddon addonType='prepend'>
                      <InputGroupText>
                        <i className='icon-user' />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input type='text' placeholder='Username' onChange={(event) => this.setState({username: event.target.value})} value={this.state.username} />
                  </InputGroup>
                  <InputGroup className='mb-4'>
                    <InputGroupAddon addonType='prepend'>
                      <InputGroupText>
                        <i className='icon-lock' />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input type='password' placeholder='Password' onChange={event => this.setState({password: event.target.value})} value={this.state.password} onKeyPress={this._handleKeyPress} />
                  </InputGroup>
                  <Row>
                    <Col xs='12' lg='auto'>
                      <Button color='primary' className='px-4 loginBtn' onClick={() => this._login()}>{this.props.t('login')}</Button>
                    </Col>
                  </Row>

                </CardBody>
              </Card>
            </Col>
            }
          </Row>
        </Container>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.login.data,
    error: state.login.error,
    fetching: state.login.fetching
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    login: (params) => dispatch(LoginActions.loginRequest(params))
  }
}

export default translate('translations')(connect(mapStateToProps, mapDispatchToProps)(Login))
