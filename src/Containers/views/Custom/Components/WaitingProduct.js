import React, { Component } from 'react'
import BaseProducts from './BaseProducts'
class WaitingProduct extends Component {
  render () {
    return (
      <BaseProducts title='Incomming Products' filterStatus='waiting' />
    )
  }
}

export default WaitingProduct
