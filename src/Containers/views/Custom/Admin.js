import React, { Component } from 'react'
import { Button, Col, Row, Card, CardHeader, CardBody, Input, CardFooter } from 'reactstrap'
import { connect } from 'react-redux'
import { AppSwitch } from '@coreui/react'
import ServerSettingActions from '../../../Redux/ServerSettingRedux'
class Admin extends Component {
  constructor (props) {
    super(props)
    this.state = {
      max_bid: 10000000000,
      auto_start: true,
      multi_auction_same_time: 1
    }
    this.props.request({command: 'get'})
  }
  componentDidMount () {

  }
  componentWillReceiveProps (props) {
    console.log(props.serverSetting)
    if (!props.serverSetting) return
    this.setState({
      multi_auction_same_time: props.serverSetting.multi_auction_same_time,
      max_bid: props.serverSetting.max_bid,
      auto_start: !!props.serverSetting.auto_start
    })
    this.forceUpdate()
  }
  updateApi () {
    this.props.request({command: 'post', auto_start: this.state.auto_start ? 1 : 0, multi_auction_same_time: this.state.multi_auction_same_time, max_bid: this.state.max_bid})
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
              <Row className='mb-2'>
                <Col xl='10'> Auto Start Auction Item </Col>
                <Col xl='2' className='text-right'>
                  <Button size='sm' color='info' onClick={() => this.setState({auto_start: !this.state.auto_start})} >
                    <i className={this.state.auto_start ? 'mr-1 fa fa-check-square-o' : 'mr-1 fa fa-square-o'} />
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col xl='8'> Max price</Col>
                <Col xl='4'> <Input type='text' value={this.state.max_bid} onChange={(event) => this.setState({max_bid: parseInt(event.target.value)})} /> </Col>
              </Row>
              <Row>
                <Col xl='8'> Max products are auctioned at the same time </Col>
                <Col xl='4'> <Input type='text' value={this.state.multi_auction_same_time} onChange={(event) => this.setState({multi_auction_same_time: parseInt(event.target.value)})} /> </Col>
              </Row>
            </CardBody>
            <CardFooter>
              <Button color='success' onClick={() => this.updateApi()} disabled={this.props.fetching} > <i className={this.props.fetching ? 'fa fa-spinner fa-spin' : 'fa fa-dot-circle-o'} /> Update and Restart Server </Button>
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
