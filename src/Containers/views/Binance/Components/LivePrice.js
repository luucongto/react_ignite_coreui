import React, { Component } from 'react'
import { Badge, Button, Card, CardBody, CardHeader, CardFooter, Form, InputGroup, InputGroupAddon, InputGroupText, Col, Row, Table, Progress, FormGroup, Label, Input } from 'reactstrap'
import { connect } from 'react-redux'
import Binance from 'binance-api-node'
import underscore from 'underscore'
import LivePriceActions from '../../../../Redux/LivePriceRedux'

import {PAIRS} from '../../../../Config/Const'

class LivePrice extends Component {
  constructor (props) {
    super(props)
    this.state = {
      marketPrices: {
      },
      watchingIds: {},
      pairs: [],
      currency: 'USDT',
      asset: this.assets('USDT')[0]
    }
    this.binance = new Binance()
    this.assets = this.assets.bind(this)
  }
  assets (currency) {
    return PAIRS[currency].assets
  }
  currencies () {
    return Object.values(PAIRS)
  }

  addPair () {
    let pair = this.state.asset + this.state.currency
    let currentPairs = Object.keys(this.state.marketPrices)
    currentPairs.push(pair)
    console.log(pair, this.state.marketPrices, currentPairs)
    this.props.update(underscore.uniq(currentPairs))
  }
  removePair (pair) {
    let pairs =  Object.keys(this.state.marketPrices)
    pairs = pairs.filter(e => e!= pair)
    console.log(pair, pairs)
    this.props.update(pairs)
  }
  _setupWatchingEnpoint (pairs) {
    console.log('Setup Socket.... ', pairs)

    let self = this
    let marketPrices = {}
    let needUpdate = false
    pairs.forEach(pair => {
      if (!this.state.marketPrices[pair]) {
        marketPrices[pair] = {maker: true, price: '...'}
        needUpdate = true
      } else {
        marketPrices[pair] = this.state.marketPrices[pair]
      }
    })
    this.setState({marketPrices})
    if (!needUpdate) return
    this.binance.ws.trades(pairs, (trades) => {
      self.watch(trades)
    })
  }

  watch (trades) {
    let marketPrices = this.state.marketPrices
    trades.price = parseFloat(trades.price)
    if(marketPrices[trades.symbol]) marketPrices[trades.symbol] = trades
    this.setState({marketPrices: marketPrices})
  }

  componentWillReceiveProps (props) {
    let openOrders = JSON.parse(JSON.stringify(props.openOrders ? props.openOrders.filter(e => (e.status !== 'done' && e.status !== 'cancel')) : [])).sort((a, b) => a.updatedAt < b.updatedAt)
    let pairs = openOrders.map(e => e.pair)
    let savedPairs = props.livePricePairs
    pairs = pairs.concat(savedPairs)
    if (pairs.length <= 0) return
    pairs = underscore.uniq(pairs)
    this._setupWatchingEnpoint(pairs)
  }
  render () {
    let pairs = Object.keys(this.state.marketPrices)
    let assets = this.assets(this.state.currency)
    let currencies = this.currencies()
    return this.props.fetching ? (<Progress animated color='danger' value='100' />)
      : (
        <div className='animated fadeIn'>
          <Row>
            <Col>
              <Card>
                <CardHeader >
                  Live Prices
                  </CardHeader>
                <CardBody>
                  <Row>
                    <Col xl='4'>
                      <FormGroup row>
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
                      </FormGroup>
                    </Col>
                    <Col xl='1'></Col>
                    <Col xl='4'>
                    <FormGroup row>
                      
                        <InputGroup>
                          <InputGroupAddon addonType='prepend'>
                            <InputGroupText>
                      Currency
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input type='select' name='currency' id='currency' onChange={(event) => this.setState({currency: event.target.value})}>
                            {
                              currencies.map(e => <option key={e.value} value={e.value} >{e.label}</option>)
                            }
                          </Input>
                        </InputGroup>
                      
                    </FormGroup>
                    </Col>
                    <Col xl='1'></Col>
                    <Col xl='2'>
                    <FormGroup row>
                        <InputGroup>
                          <Button size='l' color='success' onClick={() => this.addPair()} > Add </Button>
                        </InputGroup>
                    </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    {
                      pairs.map(pair => (
                        <Col xs='12' lg='4' xl='4' md='6' key={pair}>
                          <Button size='sm' color='danger' onClick={() => this.removePair(pair)} active><i className='fa fa-ban' /></Button>
                          {pair} 
                          <Badge color={this.state.marketPrices[pair].maker ? 'success' : 'danger'}>{this.state.marketPrices[pair].price}</Badge>
                          
                        </Col>
                      ))
                    }
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>

      )
  }
}
const mapStateToProps = (state) => {
  return {
    openOrders: state.openOrders.data,
    livePricePairs: state.livePrice.data
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    update: (pairs) => dispatch(LivePriceActions.livePriceSuccess(pairs))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LivePrice)
