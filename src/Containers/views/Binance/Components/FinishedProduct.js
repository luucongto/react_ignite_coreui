import React, { Component } from 'react'
import BaseProducts from './BaseProducts'
class FinishedProduct extends Component {
  render () {
    return (
      <BaseProducts title='Sold Products' filterStatus='finished' colLength={4} />
    )
  }
}

export default FinishedProduct
