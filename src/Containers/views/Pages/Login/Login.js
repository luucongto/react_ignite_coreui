import React, { Component } from 'react'
import { Button, Card, CardBody, CardGroup, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap'
import { AppNavbarBrand } from '@coreui/react'
import { connect } from 'react-redux'
import LoginActions from '../../../../Redux/LoginRedux'
import { GoogleLogin } from 'react-google-login'
import runtimeEnv from '@mars/heroku-js-runtime-env'
import api from '../../../../Services/Api'
import logo from '../../../assets/img/brand/Punch_Logo.png'
import sygnet from '../../../assets/img/brand/Punch_P_Logo.png'
const env = runtimeEnv()
class Login extends Component {
  constructor (props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      isAuthenticated: false,
      user: null,
      token: ''
    }
    this.googleResponse = this.googleResponse.bind(this)
    this.logout = this.logout.bind(this)
  }

  componentWillReceiveProps (props) {
    if (props.user) {
      this.props.history.push('/')
    }
  }
  logout = () => {
    this.setState({isAuthenticated: false, token: '', user: null})
  }
  googleResponse = (response) => {
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
    this.props.login({
      type: 'local',
      username: this.state.username,
      password: this.state.password
    })
  }

  render () {
    return (
      <div className='app flex-row align-items-center'>
        <Container>
          <Row className='justify-content-center mb-3'>
            <Col md='6' className='just-center text-center'>
              {/* <AppNavbarBrand
                full={{ src: sygnet, width: 300, height: 300, alt: 'Punch Logo' }} /> */}
              {window.innerWidth < 500
                ? <img src={sygnet} width='200' height='200' alt='Punch Logo' class='' />
              : <img src={logo} width='500' height='200' alt='Punch Logo' class='' />
              }
            </Col>
          </Row>
          <Row className='justify-content-center'>
            <Col md='6'>
              <Card className='p-4'>
                <CardBody>
                  <h1>Login</h1>
                  <p className='text-muted'>Sign In to your account</p>
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
                    <Input type='password' placeholder='Password' onChange={event => this.setState({password: event.target.value})} value={this.state.password} />
                  </InputGroup>
                  <Row>
                    <Col xs='12' lg='6'>
                      <Button color='primary' className='px-4 loginBtn' onClick={() => this._login()}>Login</Button>
                    </Col>
                    <Col xs='12' lg='6'>
                      <GoogleLogin
                        className='loginBtn loginBtn--google '
                        clientId={env.REACT_APP_GOOGLE_CLIENT_ID}
                        onSuccess={this.googleResponse}
                        onFailure={this.googleResponse}
                        >
                        <strong> Login With Google </strong>
                      </GoogleLogin>
                    </Col>
                  </Row>

                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
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
    login: (params) => dispatch(LoginActions.loginRequest(params))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
