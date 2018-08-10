import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Button, Row, Col, Card, CardHeader, CardBody, Collapse, FormGroup, Label, Input, Badge} from 'reactstrap'
import renderHTML from 'react-render-html'
import NoticeActions from '../../../Redux/NoticeRedux'
import InfiniteScrollList from './Components/InfiniteScrollList'
import underscore from 'underscore'
import moment from 'moment'
import { translate, Trans } from 'react-i18next'
class Notices extends Component {
  constructor (props) {
    super(props)
    this.props.request({command: this.props.user.isAdmin ? 'getAdmin' : 'get'})
    this.state = {
      title: '',
      content: '',
      start_at: 0,
      opening: 0
    }
  }
  addNotice () {
    console.log(this.state)
    this.props.request({
      command: 'post',
      title: this.state.title,
      content: this.state.content,
      start_at: this.state.start_at
    })
  }
  toggle (index) {
    this.setState({opening: this.state.opening === index ? -1 : index})
  }
  _renderAdmin () {
    const { t } = this.props
    return !this.props.user.isAdmin ? ('') : (<Col xs='12' xl='12'>
      <Card>
        <CardHeader onClick={() => this.toggle(-2)}>
          {this.props.t('insert_notice')}
        </CardHeader>
        <Collapse isOpen={this.state.opening === -2} >
          <CardBody>
            <FormGroup row>
              <Col md='1'>
                <Label htmlFor='textarea-input'>{t('title')}</Label>
              </Col>
              <Col xs='12' md='11'>
                <Input type='text' name='textarea-input' id='textarea-input' rows='9' maxLength={255} value={this.state.title} onChange={(event) => this.setState({title: event.target.value})}
                  placeholder='...' />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md='1'>
                <Label htmlFor='textarea-input'>{this.props.t('content')}</Label>
              </Col>
              <Col xs='12' md='11'>
                <Input type='textarea' name='textarea-input' id='textarea-input' rows='9' value={this.state.content} onChange={(event) => this.setState({content: event.target.value})}
                  placeholder='...' />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md='1'>
                <Label htmlFor='date-input'>{this.props.t('show')}</Label>
              </Col>
              <Col xs='12' md='11'>
                <Input type='datetime-local' id='date-input' name='datetime-local' value={moment(this.state.start_at * 1000).format('YYYY-MM-DDTHH:mm')} placeholder='date' onChange={event => {
                  this.setState({start_at: Math.floor(new Date(event.target.value).getTime() / 1000)})
                }} />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md='12'>
                <Button color='success' onClick={() => this.addNotice()} > <i className={this.props.fetching ? 'fa fa-spinner fa-spin' : 'fa fa-dot-circle-o'} /> {this.props.t('btn_add')} </Button>
              </Col>

            </FormGroup>
          </CardBody>
        </Collapse>
      </Card>
    </Col>)
  }
  render () {
    return (
      <div className='animated fadeIn'>
        <Col>
          <Row>
            {this._renderAdmin()}
          </Row>
          {this.props.notices && this.props.notices.length
          ? <InfiniteScrollList
            items={this.props.notices}
            renderItem={(notice, index) =>
              <Col xs='6' xl='6' key={index}>
                <Card>
                  <CardHeader onClick={() => this.toggle(index)}>
                    <Badge color='info'>{moment(notice.start_at * 1000).format('YYYY/MM/DD HH:mm')} </Badge> {notice.title}
                  </CardHeader>
                  <Collapse isOpen={this.state.opening === index} >
                    <CardBody>
                      {renderHTML(notice.content)}
                    </CardBody>
                  </Collapse>
                </Card>
              </Col>}
          />
          : ('')
            }
        </Col>
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.login.data,
    notices: state.notice.data,
    fetching: state.notice.fetching
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    request: (params) => dispatch(NoticeActions.noticeRequest(params))
  }
}

export default translate('translations')(connect(mapStateToProps, mapDispatchToProps)(Notices))
