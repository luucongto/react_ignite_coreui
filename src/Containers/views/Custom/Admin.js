import React, { Component } from 'react'
import { Button, Col, Row, Card, CardHeader, CardBody, Input, CardFooter, FormGroup, Label } from 'reactstrap'
import { connect } from 'react-redux'
import ServerSettingActions from '../../../Redux/ServerSettingRedux'
import AdminExport from './AdminExport'
import {translate} from 'react-i18next'
class Admin extends Component {
  constructor (props) {
    super(props)
    this.state = {
      max_bid: 10000000000,
      auto_start: true,
      multi_auction_same_time: 1,
      message: '',
      displayTo: 0

    }
    this.props.request({command: 'get'})
  }
  componentDidMount () {

  }
  componentWillReceiveProps (props) {
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
  addAnnounceMsg () {
    this.props.request({command: 'announce', message: this.state.message, displayTo: this.state.displayTo})
  }
  _renderAnnouncement () {
    return (
      <Col xl='6' xs='12'>
        <Card>
          <CardHeader>
            Announcement
          </CardHeader>
          <CardBody>
            <Row className='mb-2' >
              <Col xl='auto'> Message</Col>
              <Col xl='8'> <Input type='text' value={this.state.message} limit={255} onChange={(event) => this.setState({message: event.target.value})} /> </Col>
            </Row>
            <Row>
              <Col xl='auto'>
                <FormGroup row>
                  <Col md='auto'>
                    <Label htmlFor='date-input'>{this.props.t('Show Until')}</Label>
                  </Col>
                  <Col xs='12' md='auto'>
                    <Input type='datetime-local' id='date-input' name='datetime-local' placeholder='date' onChange={(event => this.setState({displayTo: Math.floor(new Date(event.target.value).getTime() / 1000)}))} />
                  </Col>
                </FormGroup>
              </Col>
            </Row>
          </CardBody>
          <CardFooter>
            <Button color='success' onClick={() => this.addAnnounceMsg()} disabled={this.props.fetching} > <i className={this.props.fetching ? 'fa fa-spinner fa-spin' : 'fa fa-dot-circle-o'} /> Add Announcement Message </Button>
          </CardFooter>
        </Card>
      </Col>
    )
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
        {this._renderAnnouncement()}
        <Col xl='12'>
          <AdminExport />
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

export default translate('translations')(connect(mapStateToProps, mapDispatchToProps)(Admin))
