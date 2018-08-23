import React, { Component } from 'react'
import {Badge, Row, Col} from 'reactstrap'
import {translate} from 'react-i18next'
import 'react-chat-widget/lib/styles.css'
class ChatMessage extends Component {
  render () {
    return (
      <Row className='rcw-response' >
        <Col xl='auto' className='pl-0 pr-0'><Badge color='danger'>{this.props.name}</Badge></Col>
        <div className='pl-1 pr-0 rcw-message-text'>{this.props.message}</div>
      </Row>
    )
  }
}
export default translate('translations')(ChatMessage)
