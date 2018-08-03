import React, { Component } from 'react'
import BaseProducts from './BaseProducts'
class AuctionProduct extends Component {
  render () {
    return (
      <div className='animated fadeIn pl-0 pr-0'>
        <BaseProducts title='Auctioning Products' filterStatus='bidding' colLength='12' />
        <BaseProducts title='Today Sold Products' filterStatus='finished' today colLength='4' />
      </div>
    )
  }
}

export default AuctionProduct
