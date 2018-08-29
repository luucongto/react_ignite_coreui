import React, { Component } from 'react'
import { connect } from 'react-redux'
import BaseProducts from './BaseProducts'
import ProductActions from '../../../../Redux/ProductRedux'
import Utils from '../../../../Utils/Utils'
import underscore from 'underscore'
import {translate} from 'react-i18next'
import Const from '../../../../Config/Const'
class AuctionProduct extends Component {
  constructor (props) {
    super(props)
    this.state = {
      productIds: [],
    }
  }
  componentDidMount () {
    this.setState({productIds: underscore.pluck(Object.values(this.props.products).filter(product => product.status === Const.PRODUCT_STATUS.BIDDING || product.status === Const.PRODUCT_STATUS.AUCTIONING), 'id')})
  }
  componentWillReceiveProps (props) {
    let curProductIds = Utils.clone(this.state.productIds)
    let newProductIds = underscore.pluck(Object.values(props.products).filter(product => product.status === Const.PRODUCT_STATUS.BIDDING || product.status === Const.PRODUCT_STATUS.AUCTIONING), 'id')
    let productIds = underscore.uniq(curProductIds.concat(newProductIds))
    this.setState({hasMore: Object.values(this.props.products) !== Object.values(props.products), productIds})
  }
  
  render () {
    let products = {}
    Object.values(this.props.products).forEach(product => {
      if (this.state.productIds.indexOf(product.id) >= 0) {
        products[product.id] = product
      }
    })
    return (
      <div className='animated fadeIn pl-0 pr-0'>
        <BaseProducts title={this.props.t('auctioning_products')} filterStatus={[Const.PRODUCT_STATUS.BIDDING, Const.PRODUCT_STATUS.AUCTIONING, Const.PRODUCT_STATUS.FINISHED]} order='start_at' colOpen='12' colCollapse='6' products={products} />
      </div>
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
    get: (page = 0) => dispatch(ProductActions.productRequest({command: 'get', page: page}))
  }
}

export default translate('translations')(connect(mapStateToProps, mapDispatchToProps)(AuctionProduct))
