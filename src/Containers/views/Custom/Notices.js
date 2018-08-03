import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Row, Col, Card, CardHeader, CardBody, Collapse} from 'reactstrap'
import renderHTML from 'react-render-html'
import NoticeActions from '../../../Redux/NoticeRedux'
import InfiniteScrollList from './Components/InfiniteScrollList'
import underscore from 'underscore'
import moment from 'moment'

class Notices extends Component {
  constructor (props) {
    super(props)
    this.props.get()
    this.state = {
      openning: 0
    }
  }
  _fetchMoreData (currentNotices, init = false) {
    let notices = Object.values(this.props.notices) || []
    currentNotices = init ? [] : currentNotices
    let totalWaitings = notices
    let filteredLists = totalWaitings.slice(currentNotices.length, currentNotices.length + 20)
    let newNotices = [...currentNotices, ...filteredLists]
    newNotices = underscore.sortBy(newNotices, notice => -new Date(notice.updatedAt).getTime())
    return {items: newNotices, hasMore: newNotices.length < totalWaitings.length}
  }
  toggle (index) {
    this.setState({openning: this.state.openning === index ? -1 : index})
  }
  render () {
    return (
      <div className='animated fadeIn'>
        <Col>
          <Row>

            {this.props.notices && this.props.notices.length
          ? <InfiniteScrollList
            items={this.props.notices}
            renderItem={(notice, index) =>
              <Col xs='12' xl='12' key={index}>
                <Card>
                  <CardHeader onClick={() => this.toggle(index)}>
                [{moment(notice.updatedAt).format('YYYY/MM/DD HH:mm')}] {notice.title}
                  </CardHeader>
                  <Collapse isOpen={this.state.openning === index} >
                    <CardBody>
                      {renderHTML(notice.content)}
                    </CardBody>
                  </Collapse>
                </Card>
              </Col>}
            fetchData={(init) => this._fetchMoreData(init)}
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
    get: () => dispatch(NoticeActions.noticeRequest())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Notices)
