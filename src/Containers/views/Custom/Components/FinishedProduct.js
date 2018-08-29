import React, { Component } from 'react'
import { connect } from 'react-redux'
import BaseProducts from './BaseProducts'
import ProductActions from '../../../../Redux/ProductRedux'
import {translate} from 'react-i18next'
import Const from '../../../../Config/Const'
class FinishedProduct extends Component {
  fetchMore (page) {
    this.props.get(page)
  }
  render () {
    return (
      <BaseProducts title={this.props.t('sold_products')} filterStatus={[Const.PRODUCT_STATUS.FINISHED]} colOpen='4' colCollapse='4' products={this.props.products} fetching={this.props.fetching} fetchMore={(page) => this.fetchMore(page)} />
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
