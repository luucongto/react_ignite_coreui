import React, { Component } from 'react'
import { connect } from 'react-redux'
import BaseProducts from './BaseProducts'
class WaitingProduct extends Component {
  render () {
    return (
      <BaseProducts title='Incomming Products' filterStatus='waiting' products={this.props.products} />
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

export default connect(mapStateToProps, mapDispatchToProps)(WaitingProduct)
