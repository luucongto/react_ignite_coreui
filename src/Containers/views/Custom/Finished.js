import React, { Component } from 'react'
import FinishedProduct from './Components/FinishedProduct'
class Finished extends Component {
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
        <FinishedProduct />
      </div>

    )
  }
}

export default Finished
