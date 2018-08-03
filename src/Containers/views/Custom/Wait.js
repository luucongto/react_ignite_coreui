import React, { Component } from 'react'
import WaitingProduct from './Components/WaitingProduct'
class Wait extends Component {
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
        <WaitingProduct />
      </div>

    )
  }
}

export default Wait
