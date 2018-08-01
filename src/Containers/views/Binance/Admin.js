import React, { Component } from 'react'
import { Button, Col, Row, Card, CardHeader, CardBody, Input, CardFooter } from 'reactstrap'
import { connect } from 'react-redux'
import underscore from 'underscore'
import { AppSwitch } from '@coreui/react'
import ServerSettingActions from '../../../Redux/ServerSettingRedux'
class Admin extends Component {
  constructor (props) {
    super(props)
    this.state = {
      multi_auction_same_time: 1
    }
  }
  componentWillReceiveProps (props) {

  }
  _render () {
    return (
      <Row>
        <Col xl='6' xs='12'>
          <Card>
            <CardHeader>
              Socket Bot Setting
            </CardHeader>
            <CardBody>
              <Row>
                <Col xl='10'> Auto Start Auction Item </Col>
                <Col xl='2' className='text-right'> <AppSwitch className={'mx-1'} color={'primary'} checked /> </Col>
              </Row>
              <Row>
                <Col xl='8'> Max products are auctioned at the same time </Col>
                <Col xl='4'> <Input type='number' value={this.state.multi_auction_same_time} /> </Col>
              </Row>
            </CardBody>
            <CardFooter>
              <Button color='success' onClick={() => this.updateApi()} > Update and Restart Server </Button>
            </CardFooter>
          </Card>
        </Col>
      </Row>
    )
  }
  render () {
    return (
      <div className='animated fadeIn pl-0 pr-0'>
        {this.props.user.isAdmin ? this._render()
        : (<h3> Unauthorized </h3>)}
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.login.data,
    serverSetting: state.serverSetting.data,
    fetching: state.serverSetting.fetching
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    request: (params) => dispatch(ServerSettingActions.serverSettingRequest(params))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Admin)
