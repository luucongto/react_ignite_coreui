import React, { Component } from 'react'
import { Row, Col, Progress, Button } from 'reactstrap'
import PropTypes from 'prop-types'
import underscore from 'underscore'

let LIMITAPAGE = 20
class InfiniteScrollList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      page: 0,
      items: [],
      hasMore: true,
      fetchScroll: false
    }

    this.onScroll = this.onScroll.bind(this)
  }
  _renderList (items) {
    return items.map((item, index) => this.props.renderItem(item, index))
  }
  componentDidMount () {
    window.addEventListener('scroll', this.onScroll, false)
    this._fetchMoreData(true)
  }
  componentWillReceiveProps (props) {
    if (this.props.fetchMore) {
      let currentIds = underscore.pluck(this.state.items, 'id').sort()
      let newIds = underscore.pluck(props.items, 'id').sort()
      this.setState({items: props.items, hasMore: newIds.length - currentIds.length === LIMITAPAGE && newIds.toString() !== currentIds.toString()})
    } else {
      this._fetchMoreData(true)
    }
  }
  componentWillUnmount () {
    window.removeEventListener('scroll', this.onScroll, false)
    clearTimeout(this.fetchTimeoutHandle)
  }
  onScroll () {
    var body = document.body
    var html = document.documentElement
    var docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
    if (
      (window.innerHeight + window.scrollY) >= (docHeight * 0.9) &&
      this.state.hasMore
    ) {
      this._fetchMoreData()
    }
  }
  _fetchMoreData (init = false) {
    if (this.state.fetchScroll) return
    let page = init ? 0 : this.state.page
    this.setState({fetchScroll: true})
    clearTimeout(this.fetchTimeoutHandle)
    this.fetchTimeoutHandle = setTimeout(() => {
      if (this.props.fetchMore) {
        this.props.fetchMore(page)
        this.setState({fetchScroll: false, page: page + 1})
      } else {
        page++
        let items = this.props.items.slice(0, page * LIMITAPAGE)
        let hasMore = items.length < this.props.items.length
        this.setState({fetchScroll: false, items: items, hasMore: hasMore, page: page})
      }
    }, 300)
  }
  render () {
    let loadpanel
    if (this.state.fetchScroll) {
      loadpanel = <Progress value='100' color='success' animated />
    } else if (!this.state.hasMore && this.props.endText) {
      loadpanel = <strong> {this.props.endText} </strong>
    }
    return (
      <Row>
        {this._renderList(this.state.items)}
        <Col xl='12' className='text-center mb-3'>
          {loadpanel}
        </Col>
        <Col xl='12' className='text-center mb-3'>
          {this.state.fetchScroll || !this.state.hasMore ? ('') : <Button outline size='l' color='info' onClick={() => this._fetchMoreData()}> Load More </Button>}
        </Col>
      </Row>
    )
  }
}
InfiniteScrollList.propTypes = {
  renderItem: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  fetchMore: PropTypes.func
}
export default InfiniteScrollList
