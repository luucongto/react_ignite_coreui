import React, { Component } from 'react'
import {Button, Badge, Card, CardBody, CardHeader, Col, Row, ListGroup, ListGroupItem, Input, Collapse, FormGroup, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap'
import { connect } from 'react-redux'
import moment from 'moment'
import ConfirmButton from './ConfirmButton'
import CountdownTimer from './CountdownTimer'
import NumberFormat from 'react-number-format'
import Carousels from './Carousels'
import SocketApi from '../../../../Services/SocketApi'
import logo from '../../../assets/img/brand/Punch_Logo.png'
class BiddingProductItem extends Component {
  constructor (props) {
    super(props)
    let product = this.props.product
    let bidPrice: 0
    if (product.status === 'bidding' && product.round && product.round.bid_price > 0) {
      bidPrice = product.round.bid_price + product.step_price
    } else {
      bidPrice = product.start_price
    }
    moment.relativeTimeThreshold('s', 60)
    this.state = {
      bidPrice: bidPrice,
      placingBid: false,
      isOpen: false
    }
    this._getBidder = this._getBidder.bind(this)
  }
  componentWillReceiveProps (props) {
    let product = props.product
    let bidPrice = this.state.bidPrice
    if (!product) return
    if (product.status === 'bidding' && product.round) {
      bidPrice = product.round.bid_price + product.step_price
    } else {
      bidPrice = product.start_price
    }
    this.setState({bidPrice})
    let self = this
    clearTimeout(this.timeoutHandle)
    this.timeoutHandle = setTimeout(() => {
      self.setState({placingBid: false})
    }, 100)
  }
  _renderInputItem (prependText, middle, append) {
    return (
      <FormGroup row>
        <Col xl='12'>
          <InputGroup>
            {
              prependText ? (<InputGroupAddon addonType='prepend'>
                <InputGroupText>
                  {prependText}
                </InputGroupText>
              </InputGroupAddon>) : ('')
            }
            {middle}
            { append
              ? (<InputGroupAddon addonType='append'>
                {append}
              </InputGroupAddon>) : ('')
            }
          </InputGroup>
        </Col>
      </FormGroup>
    )
  }

  placeBid () {
    this.setState({placingBid: true})
    SocketApi.emit('auction', {
      command: 'placeBid',
      product_id: this.props.product.id,
      bid_price: parseInt(this.state.bidPrice)
    })
  }

  _renderProductDetail (product, customCol = '6') {
    let items = [
    ]
    if (product.images) {
      items = items.concat(product.images)
    } else {
      items = [
        {
          src: logo,
          caption: `Step Price đ${product.step_price}`
        }
      ]
    }
    return (
      <Col xl={this.props.col === '12' ? '5' : customCol} className='mb-3'>
        <Carousels items={items} />
      </Col>
    )
  }
  _renderBidding (product) {
    let roundPrefix = {value: product.round ? product.round.num : 1, title: 'Round'}
    return (
      <Row>
        {this._renderProductDetail(product)}
        <Col xl={this.props.col === '12' ? '4' : '6'}>
          <Row className='just-center'>
            {product.round ? (<CountdownTimer autostart end={product.round.end_at} prefix={roundPrefix} />) : (
              <CountdownTimer autostart={false} duration={parseInt(product['round_time_1'])} prefix={roundPrefix} />
            )}
          </Row>
          <Row className='just-center mt-3 text-center'>
            <Col xl='12' className='text-center' id='ribbon-container' >
              <div className='ribbon-red'>
                <span id='content-red'>{this._renderCurrency(product.round ? product.round.bid_price : product.start_price)}</span>
              </div>
            </Col>
          </Row>
          <Row className='just-center mt-3'>
            {this._renderInputItem(
            'Bid',
            (<Input type='number' id='price' placeholder='Enter Bid Price' required value={this.state.bidPrice} onChange={(event) => {
              let bidPrice = parseInt(event.target.value)
              this.setState({bidPrice})
            }}
            />),
            (
              <ConfirmButton size='l' color='success' onClick={() => this.placeBid()} disabled={this.state.placingBid} ><i className={`fa ${this.state.placingBid ? 'fa-spinner fa-spin' : 'fa-shopping-basket'}`} /> BID </ConfirmButton>
            )
          )}
          </Row>
        </Col>

        <Col xl={this.props.col === '12' ? '3' : '6'}>
          <Row >
            <Col className='text-primary text-center '><h3 className='ribbon_top'>TOP BIDDERS</h3> </Col>
          </Row>
          <ListGroup>
            {product.bids ? product.bids.map((bid, index) => {
              return (<ListGroupItem key={index}>
                <strong><img src={this._getBidder(bid.user_id).image_url} className='bidder_avatar' /> {bid.user_id === this.props.user.id ? 'You' : this._getBidder(bid.user_id).name}</strong>
                <strong className='float-right'>{this._renderCurrency(bid.bid_price)}</strong>
              </ListGroupItem>)
            }) : (<ListGroupItem className='text-danger text-center'>
              Let's take the first bid!!!
              </ListGroupItem>)
        }
          </ListGroup>
        </Col>
      </Row>
    )
  }
  _renderWaiting (product) {
    return (
      <Row>
        {this._renderProductDetail(product, 8)}
        <Col xl={this.props.col === '12' ? '4' : '4'}>
          <ListGroup>
            <ListGroupItem color='success'>
              <Row>
                <Col> Start <h3>{moment(product.start_at * 1000).format('YYYY/MM/DD HH:mm')}</h3></Col>
              </Row>
            </ListGroupItem>
            <ListGroupItem color='secondary'>
              <Row>
                <Col> Start Price <h3> {this._renderCurrency(product.start_price)}</h3></Col>
                <Col> Minimum Step <h3> {this._renderCurrency(product.step_price)}</h3></Col>
              </Row>
            </ListGroupItem>

          </ListGroup>
        </Col>
      </Row>
    )
  }

  _renderFinished (product) {
    let now = parseInt(new Date().getTime() / 1000)
    if (product.start_at > now) {
      return ('')
    }
    return (
      <Row>
        <Col xl='12' >

          {/* <Col xl={this.props.col === '12' ? '4' : '6'} style={{paddingRight: 25, paddingTop: '16%'}}> */}
          <Row className='text-center just-center'>
            <Col xl='10' className='text-center' id='ribbon-container' >
              <div className='ribbon-red'>
                <span id='content-red'>{this._getBidder(product.winner_id).name}</span>
              </div>
            </Col>
          </Row>
          <Row className='text-center'>
            <Col className='text-center text-danger'>
              <h5>WIN PRICE</h5>
              <h3>{this._renderCurrency(product.win_price || 0)}</h3>
            </Col>
          </Row>
          {this._renderProductDetail(product, 12)}
        </Col>
      </Row>
    )
  }
  _renderCurrency (value) {
    return <NumberFormat value={value} displayType={'text'} thousandSeparator prefix={'đ'} />
  }
  _getBidder (userId) {
    return this.props.users && this.props.users[userId] ? this.props.users[userId] : {
      name: '...',
      image_url: ''
    }
  }
  _color (status) {
    switch (status) {
      case 'CPU':
        return 'success'
      case 'Phone':
        return 'danger'
      case 'Mac Mini':
        return 'warning'
      case 'Monitor':
        return 'info'
      case 'Keyboard':
        return 'primary'
      case 'Server':
        return 'dark'
      default:
        return 'secondary'
    }
  }
  _renderHeader (product) {
    let roundPrefix = {value: product.round ? product.round.num : 1, title: 'Round'}
    let roundHeader
    let biddingHeader
    let productInfo
    let firstColWid = 8
    let isBidDisable = false
    let topColor = 'danger'

    if (!this.state.isOpen) {
      if (product.round && product.round.bidder === this.props.user.id) {
        topColor = 'success'
        isBidDisable = true
      }
      if (product.status === 'bidding') {
        firstColWid = 6
        productInfo = (
          <Col xl={firstColWid} onClick={() => this.setState({isOpen: !this.state.isOpen})} >
            <Badge className='ml-2 pt-2' color={this._color(product.category)} > <h5>{product.category} </h5></Badge>
            <Badge className='ml-2 mr-2 pt-2' color={'dark'} > <h5>{product.ams_code} </h5></Badge>
            {product.name}
          </Col>
        )

        roundHeader = (
          <Col xl='3' xs='6' onClick={() => this.setState({isOpen: !this.state.isOpen})} >
            {product.round ? (<CountdownTimer mini autostart end={product.round.end_at} prefix={roundPrefix} />) : (<CountdownTimer mini autostart={false} d
              duration={parseInt(product['round_time_1'])} prefix={roundPrefix} />)}

          </Col>
          )

        biddingHeader = (
          <Col xl='3' xs='6' className='float-right justify-content-end text-right'>
            {/* <Badge color={topColor}>{product.round ? topText : 'Lets take the first bid' } </Badge> */}
            <Badge color={topColor} className='pt-2' ><h5>{this._renderCurrency(product.round ? product.round.bid_price : product.start_price)}</h5></Badge>
            <Button className='ml-3' color={isBidDisable ? 'secondary' : 'success'} onClick={() => this.placeBid()} disabled={isBidDisable} >
              <i className={`fa ${this.state.placingBid ? 'mr-1 fa-spinner fa-spin' : 'mr-1 fa-shopping-basket'}`} />
              Quick Bid {this._renderCurrency(this.state.bidPrice) }
            </Button>
          </Col>
        )
      } else if (product.status === 'waiting') {
        firstColWid = 6
        biddingHeader = (
          <Col xl='6' className='float-right justify-content-end text-right' onClick={() => this.setState({isOpen: !this.state.isOpen})} >
            <Badge color='success' className='mr-2 pt-2' ><h5>{moment(product.start_at * 1000).format('YYYY/MM/DD HH:mm')}</h5></Badge>
            <Badge color='info' > {this._renderCurrency(product.start_price)} </Badge>

          </Col>
        )
      } else if (product.status === 'finished') {
        biddingHeader = (
          <Col xl='4' className='float-right justify-content-end text-right' onClick={() => this.setState({isOpen: !this.state.isOpen})} >
            <Badge color={topColor}>{product.round ? this._getBidder(product.round.bidder).name : 'No one bid' } </Badge>
            <Badge color='danger'>{this._renderCurrency(product.win_price || 0)}</Badge>
          </Col>
        )
      }
    } else {
      firstColWid = 12
    }
    productInfo = (
      <Col xl={firstColWid} onClick={() => this.setState({isOpen: !this.state.isOpen})} >
        <Badge className='ml-2' color={this._color(product.category)} > {product.category} </Badge>
        <Badge className='ml-2 mr-2' color={'dark'} > {product.ams_code} </Badge>
        {product.name}
      </Col>
    )
    return (
      <CardHeader>
        <Row>
          {productInfo}
          {roundHeader}
          {biddingHeader}
        </Row>
      </CardHeader>

    )
  }
  render () {
    let product = this.props.product
    let bidPanel
    switch (product.status) {
      case 'bidding':
        bidPanel = this._renderBidding(product)
        break
      case 'finished':
        bidPanel = this._renderFinished(product)
        break
      default:
        bidPanel = this._renderWaiting(product)
    }
    return (
      <Col xl={this.props.col || '6'} className='animated fadeIn fadeOut'>
        <Card>
          {this._renderHeader(product)}
          <Collapse isOpen={this.state.isOpen} data-parent='#accordion' id='collapseOne' aria-labelledby='headingOne'>
            <CardBody>
              {
                bidPanel
              }
            </CardBody>
          </Collapse>
        </Card>
      </Col>
    )
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

export default connect(mapStateToProps, mapDispatchToProps)(BiddingProductItem)
