import React, { Component } from 'react'
import { Button, Card, CardBody, CardGroup, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap'
import { connect } from 'react-redux'
import LoginActions from '../../../../Redux/LoginRedux'

class Login extends Component {
  constructor (props) {
    super(props)
    this.state = {
      username: '',
      password: ''
    }
  }

  componentWillReceiveProps (props) {
    console.log('props', props)
    if (props.user) {
      this.props.history.push('/')
    }
  }

  _login () {
    this.props.login(this.state.username, this.state.password)
  }

  render () {
    return (
      <div className='app flex-row align-items-center'>
        <Container>
          <Row className='justify-content-center'>
            <Col md='8'>
              <CardGroup>
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
                      <Col xs='6'>
                        <Button color='primary' className='px-4' onClick={() => this._login()}>Login</Button>
                      </Col>
                      <Col xs='6' className='text-right'>
                        <Button color='link' className='px-0'>Forgot password?</Button>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                <Card className='text-white bg-primary py-5 d-md-down-none' style={{ width: 44 + '%' }}>
                  <CardBody className='text-center'>
                    <div>
                      <h2>Sign up</h2>
                      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua.</p>
                      <Button color='primary' className='mt-3' active>Register Now!</Button>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
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
    login: (username, password) => dispatch(LoginActions.loginRequest(username, password))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
