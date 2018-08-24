import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Badge} from 'reactstrap'
import {translate} from 'react-i18next'
import SocketApi from '../../../Services/SocketApi'
import underscore from 'underscore'
import Marquee from './Marquee'
import AnnouncementActions from '../../../Redux/AnnouncementRedux'

let MSG_TIME = 20000
class Announcement extends Component {
  constructor (props) {
    super(props)
    this.state = {
      message: ''
    }
    this.messages = []
    this._setupSocket()
  }
  _addMessage () {
    if (!this.handle) {
      this.handle = setInterval(() => this._addMessage(), MSG_TIME)
    }
    if (this.messages.length) {
      let message = this.messages.shift()
      this.setState({message: message.message})
      this.props.announcementUpdate([message])
    } else {
      clearInterval(this.handle)
      this.handle = null
    }
  }
  componentWillUnmount () {
    clearInterval(this.handle)
    this.handle = null
    SocketApi.removeAllListener('announcement_message')
  }
  _setupSocket () {
    let self = this
    SocketApi.on('announcement_message', data => {
      if (data.messages) {
        data.messages.forEach(element => {
          if (!self.props.announcements[element.id]) {
            self.messages.push(element)
            self.messages = underscore.uniq(self.messages, 'id')
            console.log(self.messages)
            if (!self.handle) {
              self._addMessage()
            }
          }
        })
      }
    })
  }

  render () {
    return (
      <div className='announcement_container'>
        <Marquee time={MSG_TIME / 1000}>
          {this.state.message}
        </Marquee>
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    announcements: state.announcement.data
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    announcementUpdate: (messages) => (dispatch(AnnouncementActions.announcementSuccess(messages)))
  }
}
export default translate('translations')(connect(mapStateToProps, mapDispatchToProps)(Announcement))
