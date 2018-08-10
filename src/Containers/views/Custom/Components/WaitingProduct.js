import React, { Component } from 'react'
import { connect } from 'react-redux'
import BaseProducts from './BaseProducts'
import {translate} from 'react-i18next'
class WaitingProduct extends Component {
  render () {
    return (
      <BaseProducts title={this.props.t('incoming_products')} filterStatus={['waiting']} products={this.props.products} />
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
