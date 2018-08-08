import React, { Component } from 'react'
import {Badge} from 'reactstrap'
import moment from 'moment'
class CountdownTimer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      end: props.end,
      autostart: props.autostart
    }
    this.interval = 0
  }
  componentDidMount () {
    let self = this
    if (this.state.autostart) {
      this.interval = setInterval(() => {
        self.forceUpdate()
      }, 1000)
    }
  }
  componentWillUnmount () {
    clearInterval(this.interval)
  }
  componentWillReceiveProps (props) {
    this.setState({end: props.end, autostart: props.autostart})
    if (props.autostart) {
      let self = this
      clearInterval(this.interval)
      this.interval = setInterval(() => {
        self.forceUpdate()
      }, 1000)
    }
  }
  render () {
    let m = 0
    let s = 0
    let diff = 0
    if (this.state.autostart) {
      let end = this.state.end
      diff = end - Math.floor(new Date().getTime() / 1000)
    } else {
      diff = this.props.duration || 0
    }
    if (diff > 0) {
      m = parseInt(diff / 60)
      s = (diff % 60)
    }
    m = this.pad(m)
    s = this.pad(s)
    if (this.props.mini) {
      return (
        <div style={{width: 90}}>
          <Badge color='info' className='pt-2'><h5>{this.pad(this.props.prefix.value)}</h5></Badge>
          <Badge color={diff > 60 ? 'success' : (diff > 10 ? 'warning' : 'danger')} className='pt-2 ml-2'><h5>{m}:{s}</h5></Badge>
        </div>
      )
    }
    return (
      <div id='clockdiv'>
        { this.props.prefix ? (
          <div className='prefix mr-3'>
            <span className='minutes'>{this.pad(this.props.prefix.value)}</span>
            <div className='smalltext'>{this.props.prefix.title}</div>
          </div>
        ) : ('')
        }
        <div className={this.props.autostart ? 'active mr-1' : 'mr-1'}>
          <span className='minutes'>{m}</span>
          <div className='smalltext'>Minutes</div>
        </div>
        <div className={this.props.autostart ? 'active' : ''}>
          <span className='seconds'>{s}</span>
          <div className='smalltext'>Seconds</div>
        </div>
      </div>

    )
  }

  pad (n) {
    return (n < 10 ? '0' : '') + n
  }
}

export default CountdownTimer
