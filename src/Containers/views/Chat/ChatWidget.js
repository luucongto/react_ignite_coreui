import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Widget, addResponseMessage, renderCustomComponent } from 'react-chat-widget'
import {Badge} from 'reactstrap'
import {translate} from 'react-i18next'
import 'react-chat-widget/lib/styles.css'
import SocketApi from '../../../Services/SocketApi'
import underscore from 'underscore'
import ChatMessage from './ChatMessage'
class ChatWidget extends Component {
  constructor (props) {
    super(props)
    this.handleNewUserMessage = this.handleNewUserMessage.bind(this)
    this.messageTimes = {}
    this._setupSocket()
  }
  componentWillUnmount () {
    SocketApi.removeAllListener('chat_message')
  }
  handleNewUserMessage (newMessage) {
    if (!this.props.user.isAdmin) {
      return
    }
    SocketApi.emit('chat_message', {command: 'newMessage', message: newMessage})
  }
  _setupSocket () {
    let self = this
    SocketApi.on('chat_message', data => {
      if (data.messages) {
        data.messages = data.messages.filter(message => !self.messageTimes[message.created_at])
        data.messages = underscore.uniq(data.messages, 'created_at')
        data.messages.forEach(message => {
          self._addMessage(message)
        })
      }
    })
  }
  _addMessage (data) {
    this.messageTimes[data.created_at] = data.created_at
    if (!this.props.user || data.user_id === this.props.user.id) {
      return
    }
    // addResponseMessage(`${this.props.users[data.user_id].name || ''}: ${data.message}`)
    renderCustomComponent(ChatMessage, {name: this.props.users[data.user_id].name, message: data.message})
  }
  render () {
    return <Widget handleNewUserMessage={this.handleNewUserMessage}
      title={this.props.t('chat_title')}
      subtitle={this.props.t('chat_sub')}
      senderPlaceHolder={this.props.t('chat_send_placeholder')}
    />
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.login.data,
    users: state.bidder.data
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}
export default translate('translations')(connect(mapStateToProps, mapDispatchToProps)(ChatWidget))
