import React, { Component } from 'react'
import { Card, CardBody, CardFooter, CardHeader, Col, Collapse, FormGroup, Input, Label, Row } from 'reactstrap'
import Utils from '../../../../Utils/Utils'
import ConfirmButton from './ConfirmButton'
import SocketApi from '../../../../Services/SocketApi'
import moment from 'moment'
import {translate} from 'react-i18next'
class SellerProduct extends Component {
  constructor (props) {
    super(props)
    this.state = this._initState(props.product || {})
  }
  _initState (product) {
    let images = product.images || []
    images = images.filter(image => image.src.length || image.caption.length)
    images.push({
      src: '',
      caption: ''
    })
    let state = {
      name: product.name || '',
      ams_code: product.ams_code || '',
      start_at: product.start_at || 0,
      start_price: product.start_price || 10000,
      step_price: product.step_price || 1000,
      round_time_1: product.round_time_1 || 30,
      round_time_2: product.round_time_2 || 30,
      round_time_3: product.round_time_3 || 30,
      auto_start: product.auto_start || false,
      images: images
    }
    return state
  }
  componentWillReceiveProps (props) {
    if (props.product) {
      this.setState(this._initState(props.product))
    }
  }
  action () {
    SocketApi.emit('seller', {
      command: this.props.product ? 'update' : 'add',
      id: this.props.product ? this.props.product.id : 0,
      name: this.state.name,
      ams_code: this.state.ams_code,
      start_at: this.state.start_at,
      start_price: this.state.start_price,
      step_price: this.state.step_price,
      round_time_1: this.state.round_time_1,
      round_time_2: this.state.round_time_2,
      round_time_3: this.state.round_time_3,
      auto_start: this.state.auto_start,
      images: this.state.images
    })
  }
  remove () {
    SocketApi.emit('seller', {
      command: 'remove',
      id: this.props.product ? this.props.product.id : 0
    })
  }
  render () {
    let formData = [
      {title: this.props.t('name'), value: this.state.name, type: 'text', onChange: event => this.setState({name: event.target.value})},
      {title: this.props.t('start_price'), value: this.state.start_price, type: 'number', onChange: event => this.setState({start_price: event.target.value})},
      {title: this.props.t('step_price'), value: this.state.step_price, type: 'number', onChange: event => this.setState({step_price: event.target.value})},
      {title: this.props.t('ams_code'), value: this.state.ams_code, type: 'text', onChange: event => this.setState({ams_code: event.target.value})},
      {title: this.props.t('round_time_1'), value: this.state.round_time_1, type: 'number', onChange: event => this.setState({round_time_1: event.target.value})},
      {title: this.props.t('round_time_2'), value: this.state.round_time_2, type: 'number', onChange: event => this.setState({round_time_2: event.target.value})},
      {title: this.props.t('round_time_3'), value: this.state.round_time_3, type: 'number', onChange: event => this.setState({round_time_3: event.target.value})},
      {title: this.props.t('start'), value: moment(this.state.start_at * 1000).format('YYYY-MM-DDTHH:mm'), type: 'datetime-local', onChange: event => this.setState({start_at: Math.floor(new Date(event.target.value).getTime() / 1000)})},
      {title: this.props.t('auto_start'), value: this.state.auto_start, type: 'checkbox', onChange: event => this.setState({auto_start: event.target.checked})}
    ]
    let self = this
    this.state.images.forEach((image, index) => {
      ['caption', 'src'].forEach(element => {
        formData.push(
          {
            title: element.toLocaleUpperCase() + (index + 1),
            value: self.state.images[index][element],
            type: 'text',
            col: '6',
            onChange: (event) => {
              let images = Utils.clone(self.state.images)
              images[index][element] = event.target.value
              images = images.filter(image => image.src.length || image.caption.length)
              images.push({
                src: '',
                caption: ''
              })
              self.setState({images: images})
            }})
      })
    })
    let btnAvai = (!this.props.product) ||
      (this.state.name !== this.props.product.name) ||
      (this.state.start_price !== this.props.product.start_price) ||
      (this.state.step_price !== this.props.product.step_price) ||
      (this.state.ams_code !== this.props.product.ams_code) ||
      (this.state.round_time_1 !== this.props.product.round_time_1) ||
      (this.state.round_time_2 !== this.props.product.round_time_2) ||
      (this.state.round_time_3 !== this.props.product.round_time_3) ||
      (this.state.start_at !== this.props.product.start_at) ||
      (this.state.images !== this.props.product.images)
    return (
      <Col xl='12' xs='12'>
        <Card>
          <CardHeader onClick={() => this.props.toggle(this.props.index)}>
            {this.props.header}
          </CardHeader>
          <Collapse isOpen={this.props.opening} >
            <CardBody>
              <Row>
                {formData.map(form => {
                  return (
                    <Col md={form.col || '4'} xs='12' key={form.title}>
                      <FormGroup row>
                        <Col md='5'>
                          <Label htmlFor={form.title}>{form.title}</Label>
                        </Col>
                        <Col xs='12' md='7'>
                          <Input type={form.type} id={form.title} name={form.title} maxLength={255} value={form.value} onChange={form.onChange} />
                        </Col>
                      </FormGroup>
                    </Col>
                  )
                })}
              </Row>
            </CardBody>
            <CardFooter>
              <Row>
                <Col xl='auto'>
                  <ConfirmButton color='success' onClick={() => this.action()} disabled={!btnAvai} > {this.props.t(this.props.product ? 'btn_update' : 'btn_add')} </ConfirmButton>
                </Col>
                <Col xl='auto'>
                  {this.props.product ? <ConfirmButton color='danger' onClick={() => this.remove()} > {this.props.t('remove')} </ConfirmButton> : ('')}
                </Col>
              </Row>

            </CardFooter>
          </Collapse>
        </Card>
      </Col>
    )
  }
}
export default translate('translations')(translate('translations')(SellerProduct))
