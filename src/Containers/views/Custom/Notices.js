import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Row, Col, Card, CardHeader, CardBody} from 'reactstrap'
import renderHTML from 'react-render-html'
import NoticeActions from '../../../Redux/NoticeRedux'
import InfiniteScrollList from './Components/InfiniteScrollList'
import underscore from 'underscore'
import moment from 'moment'
class Notices extends Component {
  constructor (props) {
    super(props)
    this.props.get()
  }
  _fetchMoreData (currentNotices, init = false) {
    let notices = Object.values(this.props.notices) || []
    currentNotices = init ? [] : currentNotices
    let totalWaitings = notices
    let filteredLists = totalWaitings.slice(currentNotices.length, currentNotices.length + 20)
    let newNotices = [...currentNotices, ...filteredLists]
    underscore.sortBy(newNotices, notice => notice.updatedAt)
    return {items: newNotices, hasMore: newNotices.length < totalWaitings.length}
  }
  render () {
    return (
      <div className='animated fadeIn'>
        <Row>
          <Col xs='12' xl='6'>
            {this.props.notices && this.props.notices.length
          ? <InfiniteScrollList
            items={this.props.notices}
            renderItem={(notice, index) => <Card key={index}>
              <CardHeader>
                [{moment(notice.updatedAt).format('YYYY/MM/DD HH:mm')}] {notice.title}
              </CardHeader>
              <CardBody>
                {renderHTML(notice.content)}
              </CardBody>
            </Card>}
            fetchData={(init) => this._fetchMoreData(init)}
          />
          : ('Yay! There isn\'t any notices now. Let\'s try again later!!!')
            }
          </Col>
        </Row>
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
