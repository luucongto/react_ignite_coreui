import React, { Component } from 'react'
import { Button, Card, CardBody, CardHeader, Col, Row,
  CardFooter,
  FormGroup,
  Input,
  Label,
  Progress
} from 'reactstrap'

class ConfirmButton extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isConfirming: false
    }
  }
  cancel () {
    this.setState({isConfirming: false})
  }
  click () {
    if (this.state.isConfirming) {
      this.props.onClick()
      this.cancel()
    } else {
      this.setState({isConfirming: true})
      setTimeout(this.cancel.bind(this), 5000)
    }
  }

  render () {
    if (this.state.isConfirming) {
      return (
        <div className={this.props.className || ''}>
          <Button size={this.props.size || 'sm'} active color='danger' disabled={this.props.disabled} onClick={() => this.cancel()}>
            <i className='fa fa-ban' />
          </Button>
          <Button className='ml-2' size={this.props.size || 'sm'} active color='success' disabled={this.props.disabled} onClick={() => this.click()}>
            <i className='fa fa-check' />
          </Button>
        </div>
      )
    } else {
      return (
        <Button className={this.props.className || ''} size={this.props.size || 'sm'} disabled={this.props.disabled} color={this.props.color || 'success'} onClick={() => this.click()}>
          {this.props.children}
        </Button>
      )
    }
  }
}

export default ConfirmButton
