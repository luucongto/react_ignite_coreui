import React, { Component } from 'react'
import { connect } from 'react-redux'
import BaseProducts from './BaseProducts'
import ProductActions from '../../../../Redux/ProductRedux'
class FinishedProduct extends Component {
  constructor (props) {
    super(props)
    this.state = {
      page: -1
    }
  }
  componentWillReceiveProps (props) {
    this.setState({hasMore: Object.values(this.props.products) !== Object.values(props.products)})
  }
  fetchMore (page) {
    this.props.get(page)
    let hasMore = this.state.page < page
    this.setState({page})
    return {
      hasMore
    }
  }
  render () {
    return (
      <BaseProducts title='Sold Products' filterStatus={['finished']} colOpen='4' colCollapse='4' products={this.props.products} fetchMore={(page) => this.fetchMore(page)} />
    )
  }
}
const mapStateToProps = (state) => {
  return {
    products: state.product.data,
    fetching: state.product.fetching
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    get: (page = 0) => dispatch(ProductActions.productRequest({command: 'get', page: page}))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FinishedProduct)
