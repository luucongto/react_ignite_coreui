import React, { Component } from 'react'
import { connect } from 'react-redux'
import BaseProducts from './BaseProducts'
class AuctionProduct extends Component {
  render () {
    return (
      <div className='animated fadeIn pl-0 pr-0'>
        <BaseProducts title='Auctioning Products' filterStatus='bidding' colLength='12' products={this.props.products} />
        <BaseProducts title='Today Sold Products' filterStatus='finished' today colLength='4'products={this.props.products} />
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuctionProduct)
