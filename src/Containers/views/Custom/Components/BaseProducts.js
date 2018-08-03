import React, { Component } from 'react'
import { Card, CardHeader, CardBody, Badge, FormGroup, Input, Label, Button, Col, Row, Progress } from 'reactstrap'
import { connect } from 'react-redux'
import BiddingProductItem from './BiddingProductItem'
import InfiniteScrollList from './InfiniteScrollList'
import underscore from 'underscore'
class BaseProducts extends Component {
  constructor (props) {
    super(props)
    this.state = {
      filters: {
        Phone: true,
        CPU: true,
        'Mac Mini': true,
        Monitor: true,
        Keyboard: true,
        Server: true,
        UPS: true
      }
    }
    this._fetchMoreData = this._fetchMoreData.bind(this)
  }
  _color (status) {
    switch (status) {
      case 'CPU':
        return 'success'
      case 'Phone':
        return 'danger'
      case 'Mac Mini':
        return 'warning'
      case 'Monitor':
        return 'info'
      case 'Keyboard':
        return 'primary'
      case 'Server':
        return 'dark'
      default:
        return 'secondary'
    }
  }
  _renderList (products, colLength = '6') {
    return (
      <Row>
        {products.map((product, index) => <BiddingProductItem col={colLength} product={product} key={index} placeBid={(params) => this.placeBid(params)} />)}
      </Row>
    )
  }

  _fetchMoreData (currentProducts, init = false) {
    let products = Object.values(this.props.products) || []
    currentProducts = init ? [] : currentProducts
    let totalWaitings = products
    if (this.props.today) {
      let today = new Date().toDateString()

      totalWaitings = products.filter(product => {
        return new Date(product.updatedAt).toDateString() === today
      })
    }
    totalWaitings = totalWaitings.filter(product => product.status === this.props.filterStatus)
    Object.keys(this.state.filters).forEach(filter => {
      if (!this.state.filters[filter]) {
        totalWaitings = totalWaitings.filter(product => product.category !== filter)
      }
    })
    let filteredLists = totalWaitings.slice(currentProducts.length, currentProducts.length + 20)
    let newProducts = [...currentProducts, ...filteredLists]
    newProducts = underscore.uniq(newProducts)
    return {items: newProducts, hasMore: newProducts.length < totalWaitings.length}
  }
  render () {
    let self = this
    return (
      <Col xl='12' xs='12'>
        <Row>
          <Col xl='12' className='text-center' style={{zIndex: 1}} >
            <div className='ribbon'>
              <span id='content'>{this.props.title}</span>
            </div>
          </Col>
        </Row>
        <Card>
          <CardHeader>
            {
              Object.keys(this.state.filters).map(filter => (
                <Button key={filter} size='sm' className='ml-1' color={this._color(filter)} onClick={() => {
                  let filters = JSON.parse(JSON.stringify(this.state.filters))
                  filters[filter] = !filters[filter]
                  self.setState({filters})
                }} >
                  <i className={this.state.filters[filter] ? 'mr-1 fa fa-check-square-o' : 'mr-1 fa fa-square-o'} />
                  {filter}
                </Button>
              ))
            }
          </CardHeader>
        </Card>
        <Row>
          <InfiniteScrollList ref='scrollList'
            items={this.props.products}
            renderItem={(product, index) => <BiddingProductItem col={this.props.colLength} product={product} key={index} placeBid={(params) => this.placeBid(params)} />}
            fetchData={(currentProducts, init) => this._fetchMoreData(currentProducts, init)}
        />
        </Row>
      </Col>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    login: state.login.data,
    products: state.product.data
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BaseProducts)
