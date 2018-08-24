
'use strict'
import React from 'react'
class Marquee extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      running: false
    }
  }
  componentWillReceiveProps(props){
    this.setState({running: true})
    setTimeout(() => {
      this.setState({running: false})
    }, 18000);
  }
  render () {
    let custom = `marquee ${this.props.time || 20}s linear ${this.props.loop ? 'infinite' : ''}`

    return (
      <div className={'marquee'} style={this.state.running ? {
        WebkitAnimation: custom,
        MozAnimation: custom,
        MsAnimation: custom,
        OAnimation: custom,
        animation: custom
      } : {}}> {this.props.children}
      </div>
    )
  }
}

export default Marquee
