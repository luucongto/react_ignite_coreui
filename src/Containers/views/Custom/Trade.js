import React, { Component } from 'react'
import AuctionProduct from './Components/AuctionProduct'
class Trade extends Component {
  constructor (props) {
    super(props)
    this.toggle = this.toggle.bind(this)
    this.state = {
      activeTab: '1'
    }
  }

  toggle (tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      })
    }
  }
  render () {
    return (
      <div className='animated fadeIn'>
        <AuctionProduct />
      </div>

    )
  }
}

export default Trade
