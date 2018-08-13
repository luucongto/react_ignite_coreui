import React, { Component } from 'react'
import { connect } from 'react-redux'
import BaseProducts from './BaseProducts'
import ProductActions from '../../../../Redux/ProductRedux'
import {translate} from 'react-i18next'
import Const from '../../../../Config/Const'
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
      <BaseProducts title={this.props.t('sold_products')} filterStatus={[Const.PRODUCT_STATUS.FINISHED]} colOpen='4' colCollapse='4' products={this.props.products} fetchMore={(page) => this.fetchMore(page)} />
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

export default translate('translations')(connect(mapStateToProps, mapDispatchToProps)(FinishedProduct))
