import React, { Component } from 'react'
import { Card, CardHeader, Button, Col, Row } from 'reactstrap'
import BiddingProductItem from './BiddingProductItem'
import InfiniteScrollList from './InfiniteScrollList'
import Utils from '../../../../Utils/Utils'
import underscore from 'underscore'
import PropTypes from 'prop-types'
class BaseProducts extends Component {
  constructor (props) {
    super(props)
    let filters = {
      Phone: true,
      CPU: true,
      'Mac Mini': true,
      Monitor: true,
      Keyboard: true,
      Server: true,
      UPS: true
    }
    this.state = {
      products: this._filter(Object.values(props.products) || [], filters),
      filters: filters
    }
  }
  componentWillReceiveProps (props) {
    this.setState({products: this._filter(Object.values(props.products) || [], this.state.filters)})
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

  _filter (products, filters) {
    let totalWaitings = products
    if (this.props.today) {
      let today = new Date().toDateString()

      totalWaitings = products.filter(product => {
        return new Date(product.updatedAt).toDateString() === today
      })
    }
    Object.keys(filters).forEach(filter => {
      if (!filters[filter]) {
        totalWaitings = totalWaitings.filter(product => product.category !== filter)
      }
    })
    totalWaitings = totalWaitings.filter(product => product.status === this.props.filterStatus)
    totalWaitings = underscore.sortBy(totalWaitings, 'id')
    return totalWaitings
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
                <Button key={filter} size='sm' className='mr-1 mt-1' color={this._color(filter)} onClick={() => {
                  let filters = Utils.clone(self.state.filters)
                  filters[filter] = !filters[filter]
                  self.setState({filters, products: self._filter(Object.values(self.props.products), filters)})
                }} >
                  <i className={this.state.filters[filter] ? 'mr-1 fa fa-check-square-o' : 'mr-1 fa fa-square-o'} />
                  {filter}
                </Button>
              ))
            }
          </CardHeader>
        </Card>

        <InfiniteScrollList ref='scrollList'
          items={this.state.products}
          renderItem={(product, index) => <BiddingProductItem col={this.props.colLength} product={product} key={index} placeBid={(params) => this.placeBid(params)} />}
        />
      </Col>
    )
  }
}
BaseProducts.propTypes = {
  products: PropTypes.object
}
export default BaseProducts
