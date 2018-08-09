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
    this._fetchMoreData(true)
  }
  componentWillReceiveProps (props) {
    if (this.props.fetchMore) {
      this.setState({items: props.items})
    } else {
      this._fetchMoreData(true)
    }
  }
  componentWillUnMount () {
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
    this.setState({fetchScroll: true})

    if (this.props.fetchMore) {
      let {hasMore} = this.props.fetchMore(Math.floor(this.state.items.length / LIMITAPAGE))
      this.setState({fetchScroll: false, hasMore: hasMore})
    } else {
      clearTimeout(this.fetchTimeoutHandle)
      this.fetchTimeoutHandle = setTimeout(() => {
        let items = this.props.items.slice(0, init ? LIMITAPAGE : this.state.items.length + LIMITAPAGE)
        let hasMore = (init ? LIMITAPAGE : this.state.items.length + LIMITAPAGE) <= this.props.items.length
        this.setState({fetchScroll: false, items: items, hasMore: hasMore})
      }, 300)
    }
  }
  render () {
    let loadpanel
    if (this.state.fetchScroll) {
      loadpanel = <Progress value='100' animated />
    } else if (this.state.hasMore) {
      loadpanel = <Button size='l' color='info' onClick={() => this._fetchMoreData()}> Load More </Button>
    } else if (this.props.endText) {
      loadpanel = <strong> {this.props.endText} </strong>
    }
    return (
      <Row>
        {this._renderList(this.state.items)}
        <Col xl='12' className='text-center mb-3'>
          {loadpanel}
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
