import React, { Component } from 'react'
import { connect } from 'react-redux'
import BaseProducts from './BaseProducts'
class FinishedProduct extends Component {
  render () {
    return (
      <BaseProducts title='Sold Products' filterStatus='finished' colLength={4} products={this.props.products} />
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

export default connect(mapStateToProps, mapDispatchToProps)(FinishedProduct)
