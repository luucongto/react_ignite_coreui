import React, { Component } from 'react'
import { Row, Col, Progress, Button } from 'reactstrap'
import PropTypes from 'prop-types'
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
    if (this.props.items && Object.values(this.props.items).length) {
      this._fetchMoreData(true)
    }
  }
  componentWillReceiveProps (props) {
    if (props.items && Object.values(props.items).length) {
      this._fetchMoreData(true)
    }
  }
  componentWillUnMount () {
    window.removeEventListener('scroll', this.onScroll, false)
    clearTimeout(this.fetchTimeoutHandle)
  }
  onScroll () {
    if (
      (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500) &&
      this.state.hasMore
    ) {
      this._fetchMoreData()
    }
  }
  _fetchMoreData (init = false) {
    if (this.state.fetchScroll) return
    this.setState({fetchScroll: true})
    this.fetchTimeoutHandle = setTimeout(() => {
      let items = this.props.items.slice(0, init ? LIMITAPAGE : this.state.items.length + LIMITAPAGE)
      let hasMore = (init ? LIMITAPAGE : this.state.items.length + LIMITAPAGE) <= this.props.items.length
      this.setState({fetchScroll: false, items: items, hasMore: hasMore})
    }, 300)
  }
  render () {
    return (
      <Row>
        {this._renderList(this.state.items)}
        <Col xl='12' className='text-center'>
          {this.state.fetchScroll ? <Progress value='100' animated /> : !this.state.hasMore ? <strong> You read 'em all!!! </strong> : (<Button size='l' color='info' onClick={() => this._fetchMoreData()}> Load More </Button>)}
        </Col>
      </Row>
    )
  }
}
InfiniteScrollList.propTypes = {
  renderItem: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired
}
export default InfiniteScrollList
