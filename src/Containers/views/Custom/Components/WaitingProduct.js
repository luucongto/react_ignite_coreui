import React, { Component } from 'react'
import { connect } from 'react-redux'
import BaseProducts from './BaseProducts'
import {translate} from 'react-i18next'
import Const from '../../../../Config/Const'
class WaitingProduct extends Component {
  render () {
    return (
      <BaseProducts title={this.props.t('incoming_products')} filterStatus={[Const.PRODUCT_STATUS.WAITING]} products={this.props.products} />
    )
  }
}
const mapStateToProps = (state) => {
  return {
    products: state.product.data
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default translate('translations')(connect(mapStateToProps, mapDispatchToProps)(WaitingProduct))
