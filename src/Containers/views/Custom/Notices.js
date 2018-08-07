import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Button, Row, Col, Card, CardHeader, CardBody, Collapse, FormGroup, Label, Input} from 'reactstrap'
import renderHTML from 'react-render-html'
import NoticeActions from '../../../Redux/NoticeRedux'
import InfiniteScrollList from './Components/InfiniteScrollList'
import underscore from 'underscore'
import moment from 'moment'

class Notices extends Component {
  constructor (props) {
    super(props)
    this.props.request({command: this.props.user.isAdmin ? 'getAdmin' : 'get'})
    this.state = {
      notices: [],
      title: null,
      content: null,
      start_at: null,
      openning: 0
    }
  }
  addNotice () {
    this.props.request({
      command: 'post',
      title: this.state.title,
      content: this.state.content,
      start_at: Math.floor(new Date(this.state.start_at).getTime() / 1000)
    })
  }
  _filter (notices) {
    return underscore.sortBy(notices, notice => -notice.start_at)
  }
  compomentWillReceiveProps (props) {
    if (props.notices) {
      this.setState({notice: this._filter(props.notices)})
    }
  }
  _fetchMoreData (currentNotices, init = false) {
    let notices = Object.values(this.props.notices) || []
    currentNotices = init ? [] : currentNotices
    let totalWaitings = notices
    let filteredLists = totalWaitings.slice(currentNotices.length, currentNotices.length + 20)
    let newNotices = [...currentNotices, ...filteredLists]
    newNotices = underscore.sortBy(newNotices, notice => -notice.start_at)
    return {items: newNotices, hasMore: newNotices.length < totalWaitings.length}
  }
  toggle (index) {
    this.setState({openning: this.state.openning === index ? -1 : index})
  }
  _renderAdmin () {
    return !this.props.user.isAdmin ? ('') : (<Col xs='12' xl='12'>
      <Card>
        <CardHeader onClick={() => this.toggle(-2)}>
        Insert notice
      </CardHeader>
        <Collapse isOpen={this.state.openning === -2} >
          <CardBody>
            <FormGroup row>
              <Col md='1'>
                <Label htmlFor='textarea-input'>Title</Label>
              </Col>
              <Col xs='12' md='11'>
                <Input type='text' name='textarea-input' id='textarea-input' rows='9' maxlength='255' value={this.state.title} onChange={(event) => this.setState({title: event.target.value})}
                  placeholder='Content...' />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md='1'>
                <Label htmlFor='textarea-input'>Content</Label>
              </Col>
              <Col xs='12' md='11'>
                <Input type='textarea' name='textarea-input' id='textarea-input' rows='9' value={this.state.content} onChange={(event) => this.setState({content: event.target.value})}
                  placeholder='Content...' />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md='1'>
                <Label htmlFor='date-input'>Show</Label>
              </Col>
              <Col xs='12' md='11'>
                <Input type='datetime-local' id='date-input' name='date-input' placeholder='date' value={this.state.start_at} onChange={(event) => this.setState({start_at: event.target.value})} />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md='12'>
                <Button color='success' onClick={() => this.addNotice()} > <i className={this.props.fetching ? 'fa fa-spinner fa-spin' : 'fa fa-dot-circle-o'} /> Add </Button>
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
            {this.props.notices && this.props.notices.length
          ? <InfiniteScrollList
            items={this.state.notices}
            renderItem={(notice, index) =>
              <Col xs='12' xl='12' key={index}>
                <Card>
                  <CardHeader onClick={() => this.toggle(index)}>
                [{moment(notice.start_at * 1000).format('YYYY/MM/DD HH:mm')}] {notice.title}
                  </CardHeader>
                  <Collapse isOpen={this.state.openning === index} >
                    <CardBody>
                      {renderHTML(notice.content)}
                    </CardBody>
                  </Collapse>
                </Card>
              </Col>}
          />
          : ('Yay! There isn\'t any notices now. Let\'s try again later!!!')
            }

          </Row>
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

export default connect(mapStateToProps, mapDispatchToProps)(Notices)
