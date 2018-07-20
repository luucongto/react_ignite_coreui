import React, { Component } from 'react'
import { Button, Card, CardBody, CardHeader, Col, Row,
  CardFooter,
  FormGroup,
  Input,
  Label,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Progress,
  Collapse
} from 'reactstrap'
import { connect } from 'react-redux'
import OpenOrdersActions from '../../../../Redux/OpenOrdersRedux'
import {PAIRS} from '../../../../Config/Const'
import SocketApi from '../../../../Services/SocketApi'
import Alert from 'react-s-alert'
class PlaceOrder extends Component {
  constructor (props) {
    super(props)
    this.assets = this.assets.bind(this)
    this.currencies = this.currencies.bind(this)
    this.state = {
      show: false,
      quantity: 0,
      asset: this.assets('USDT')[0],
      currency: 'USDT',
      type: this.types()[0].value,
      offset: 0,
      price: 0,
      total: 0
    }
  }
  types () {
    return [{value: 'TEST', label: 'TEST'},
    {value: 'REAL', label: 'REAL'}]
  }
  assets (currency) {
    return PAIRS[currency].assets
  }

  currencies () {
    return Object.values(PAIRS)
  }
  placeOrder () {
    console.log(this.state)
    if (this.state.asset === this.state.currency) return
    if (this.state.expect_price <= 0 || this.state.quantity <= 0) return

    SocketApi.emit('update_order', {
      command: 'placeOrder',
      pair: this.state.asset + this.state.currency,
      asset: this.state.asset,
      currency: this.state.currency,
      price: 0,
      quantity: this.state.quantity,
      mode: this.props.mode,
      type: this.state.type,
      offset: this.state.offset,
      expect_price: this.state.expect_price
    })
    Alert.info(`Added Order ${this.state.type} ${this.props.mode} ${ this.state.quantity}${this.state.asset} at ${this.state.expect_price}${this.state.currency}`, {
      position: 'bottom-right',
      effect: 'bouncyflip'
    })
  }
  resetOrder () {
    this.setState({
      quantity: 0,
      asset: this.assets('USDT')[0],
      currency: 'USDT',
      type: this.types()[0].value,
      price: 0,
      total: 0
    })
  }
  render () {
    let assets = this.assets(this.state.currency)

    let currencies = this.currencies()
    let types = this.types()
    let offsetButtons = [1, 2, 3, 5, 10]
    return (
      <Col>
        <Card>
          <CardHeader onClick={() => this.setState({show: !this.state.show})}>
            <i className='fa fa-align-justify' /> {this.props.mode.toUpperCase()}
            <a className=" float-right mb-0 card-header-action btn btn-minimize"><i className={this.state.show ? "icon-arrow-up" : "icon-arrow-down"}></i></a>
          </CardHeader>
          <Collapse isOpen={this.state.show}>
          <CardBody>
            <Row>
              <Col lg='12' md='12' xl='6'>
                <FormGroup row>
                  <Col xl='12' xs='12' sm='12'>
                    <InputGroup>

                      <InputGroupAddon addonType='prepend'>
                        <InputGroupText>
                                Quantity
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type='number' id='quantity' placeholder='Enter quantity' required value={this.state.quantity} onChange={(event) => {
                        let quantity = parseFloat(event.target.value)
                        let total = (quantity * this.state.expect_price) || 0
                        this.setState({quantity, total})
                      }} />
                      <InputGroupAddon addonType='append'>
                        <InputGroupText>
                          {this.state.asset}
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Col xl='12'>
                    <InputGroup>
                      <InputGroupAddon addonType='prepend'>
                        <InputGroupText>
                          Expect Price
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type='number' id='price' placeholder='0' required value={this.state.expect_price} onChange={(event) => {
                        let expectPrice = parseFloat(event.target.value)
                        expectPrice = expectPrice > 0 ? expectPrice : 0
                        let total = this.state.quantity * expectPrice
                        this.setState({expect_price: expectPrice, total})
                      }} />
                      <InputGroupAddon addonType='append'>
                        <InputGroupText>
                          {this.state.currency}/1{this.state.asset}
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Col xl='12'>
                    <InputGroup>
                      <InputGroupAddon addonType='prepend'>
                        <InputGroupText>
                          Offset
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type='number' id='price' placeholder='0' required value={this.state.offset} onChange={(event) => {
                        this.setState({offset: event.target.value})
                      }} />
                      <InputGroupAddon addonType='append'>
                        <InputGroupText>
                          {this.state.currency}
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col xl='12'>
                    <InputGroup>
                      <Row>
                        {
                          offsetButtons.map(offsetButton => (<Col xs='2' key={offsetButton}><Button color={this.props.mode === 'buy' ? 'success' : 'danger'} active onClick={() => this.setState({offset: this.state.expect_price * offsetButton / 100})
                          }> {offsetButton}%  </Button></Col>))
                        }
                      </Row>
                    </InputGroup>
                  </Col>
                </FormGroup>
              </Col>

              <Col>
                <FormGroup row>
                  <Col xl='12'>
                    <InputGroup>
                      <InputGroupAddon addonType='prepend'>
                        <InputGroupText>
                          Type
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type='select' name='type' id='type' value={this.state.type} onChange={(event) => this.setState({type: event.target.value})}>
                        {
                          types.map(e => <option key={e.value} value={e.value} >{e.label}</option>)
                        }
                      </Input>
                    </InputGroup>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col xl='12'>
                    <InputGroup>
                      <InputGroupAddon addonType='prepend'>
                        <InputGroupText>
                          Asset
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type='select' name='asset' id='asset' value={this.state.asset} onChange={(event) => this.setState({asset: event.target.value})}>
                        {
                          assets.map(e => <option key={e} value={e} >{e}</option>)
                        }
                      </Input>
                    </InputGroup>
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Col xl='12'>
                    <InputGroup>
                      <InputGroupAddon addonType='prepend'>
                        <InputGroupText>
                          Currency
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type='select' name='currency' id='currency' onChange={(event) => {
                        this.setState({currency: event.target.value, asset: this.assets(event.target.value)[0]})
                      }}>
                        {
                          currencies.map(e => <option key={e.value} value={e.value} >{e.label}</option>)
                        }
                      </Input>
                    </InputGroup>
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Col xl='12'>
                    <InputGroup>
                      <InputGroupAddon addonType='prepend'>
                        <InputGroupText>
                          Total
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type='number' id='name' placeholder='Enter total' required value={this.state.total} onChange={(event) => {
                        try {
                          let total = parseFloat(event.target.value)
                          if (this.state.expect_price > 0) {
                            let quantity = total / this.state.expect_price
                            this.setState({total, quantity})
                          } else {
                            let price = total / this.state.quantity
                            this.setState({total, price})
                          }
                        } catch (e) {
                          console.log(e, event)
                        }
                      }} />
                      <InputGroupAddon addonType='append'>
                        <InputGroupText>
                          {this.state.currency}
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                  </Col>
                </FormGroup>
              </Col>
            </Row>
          </CardBody>
          <CardFooter>
            <Row>
              <Col xs='6' xl='2'><Button size='l' color={this.props.mode === 'buy' ? 'success' : 'danger'} onClick={() => this.placeOrder()} ><i className='fa fa-dot-circle-o' /> {this.props.mode.toUpperCase()}</Button></Col>
              <Col xs='6' xl='2'><Button size='l' color='warning' onClick={() => this.resetOrder()}><i className='fa fa-ban' /> Reset</Button></Col>
            </Row>
          </CardFooter>
          </Collapse>
        </Card>
      </Col>
    )
  }
}
const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    request: (params) => dispatch(OpenOrdersActions.openOrdersRequest(params))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaceOrder)
