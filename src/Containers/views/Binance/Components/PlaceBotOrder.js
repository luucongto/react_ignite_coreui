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
class PlaceBotOrder extends Component {
  constructor (props) {
    super(props)
    this.assets = this.assets.bind(this)
    this.currencies = this.currencies.bind(this)
    this.state = {
      show: false,
      asset: this.assets('USDT')[0],
      currency: 'USDT',
      strategy: this.strategys()[0].value,
      offset: 0,
      currency_num: 0,
      asset_num: 0
    }
  }
  strategys () {
    return [{value: 'TRAILING', label: 'TRAILING'}]
  }
  assets (currency) {
    return PAIRS[currency].assets
  }

  currencies () {
    return Object.values(PAIRS)
  }
  placeOrder () {
    if (this.state.asset === this.state.currency) return
    if (this.state.offset <= 0) return
    SocketApi.emit('auto_order', {
      command: 'placeOrder',
      pair: this.state.asset + this.state.currency,
      asset: this.state.asset,
      currency: this.state.currency,
      currency_num: this.state.currency_num,
      asset_num: this.state.asset_num,
      strategy: this.state.strategy,
      offset: this.state.offset,
    })
    Alert.info(`Added Auto Order ${this.state.currency_num}${ this.state.currency} / ${this.state.asset_num+this.state.asset} ~ ${ this.state.offset}`, {
      position: 'bottom-right',
      effect: 'bouncyflip'
    })
  }
  resetOrder () {
    this.setState({
      asset: this.assets('USDT')[0],
      currency: 'USDT',
      strategy: this.strategys()[0].value,
      offset: 0,
      currency_num: 0,
      asset_num: 0
    })
  }
  render () {
    let assets = this.assets(this.state.currency)

    let currencies = this.currencies()
    let strategys = this.strategys()
    let offsetButtons = [1, 2, 3, 5, 10]
    return (
      <Col>
        <Card>
          <CardHeader  onClick={() => this.setState({show: !this.state.show})}>
            <i className='fa fa-align-justify' /> Add Auto (test)
            <a className=" float-right mb-0 card-header-action btn btn-minimize"><i className={this.state.show ? "icon-arrow-up" : "icon-arrow-down"}></i></a>
          </CardHeader>
          <Collapse isOpen={this.state.show}>
          <CardBody>
            <Row>
              <Col lg='12' md='12' xl='6'>
                <FormGroup row>
                  <Col xl='12'>
                    <InputGroup>

                      <InputGroupAddon addonType='prepend'>
                        <InputGroupText>
                                Balance
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type='number' id='currency_num' placeholder='Enter currency num' required value={this.state.currency_num} onChange={(event) => {
                        let currency_num = parseFloat(event.target.value)
                        this.setState({currency_num})
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
                      <InputGroupAddon addonType='prepend'>
                        <InputGroupText>
                          Asset
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type='number' id='price' placeholder='0' required value={this.state.asset_num} onChange={(event) => {
                        let asset_num = parseFloat(event.target.value)
                        this.setState({asset_num})
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
                      <Input type='select' name='strategy' id='strategy' value={this.state.strategy} onChange={(event) => this.setState({strategy: event.target.value})}>
                        {
                          strategys.map(e => <option key={e.value} value={e.value} >{e.label}</option>)
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

              </Col>
            </Row>
          </CardBody>
          <CardFooter>
            <Row>
              <Col xs='6' xl='2'><Button size='l' color='success' onClick={() => this.placeOrder()} ><i className='fa fa-dot-circle-o' /> Add </Button></Col>
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

export default connect(mapStateToProps, mapDispatchToProps)(PlaceBotOrder)
