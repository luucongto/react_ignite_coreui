import React, { Component } from 'react'
import { UncontrolledTooltip, Button, Badge, Card, CardBody, CardHeader, Col, Row, ListGroup, ListGroupItem, Input, Collapse, FormGroup, InputGroup, InputGroupAddon, InputGroupText, ListGroupItemText } from 'reactstrap'
import { connect } from 'react-redux'
import moment from 'moment'
import ConfirmButton from './ConfirmButton'
import CountdownTimer from './CountdownTimer'
import NumberFormat from 'react-number-format'
import Carousels from './CarouselsThumb'
import SocketApi from '../../../../Services/SocketApi'
import Const from '../../../../Config/Const'
import logo from '../../../assets/img/brand/Punch_Logo.png'
import pLogo from '../../../assets/img/brand/Punch_P_Logo.png'
import { translate } from 'react-i18next'
class BiddingProductItem extends Component {
  constructor (props) {
    super(props)
    let product = this.props.product
    let bidPrice = 0
    let autoBidPrice = 0
    if(props.autoBids && props.autoBids[product.id]){
      autoBidPrice = props.autoBids[product.id].price
    }
    if (product.status === Const.PRODUCT_STATUS.BIDDING && product.round && product.round.bid_price > 0) {
      bidPrice = product.round.bid_price + product.step_price
    } else {
      bidPrice = product.start_price
    }
    moment.relativeTimeThreshold('s', 60)
    this.state = {
      bidPrice: bidPrice,
      editingAutoBid: false,
      autoBidPrice: autoBidPrice,
      placingBid: false,
      placingAutoBid: false,
      currentProductId: 0
    }
    this._getBidder = this._getBidder.bind(this)
    this._updateBidMsg = this._updateBidMsg.bind(this)
    this._updateAutoBidMsg = this._updateAutoBidMsg.bind(this)
    SocketApi.on('bid_message', this._updateBidMsg)
    SocketApi.on('auto_bid_message', this._updateAutoBidMsg)
  }
  _updateBidMsg (data) {
    if (data.productId === this.props.product.id) {
      let self = this
      setTimeout(() => {
        self.setState({placingBid: false})
      }, 500)
    }
  }
  _updateAutoBidMsg (data) {
    console.log(data)
    if (data.productId === this.props.product.id) {
      let self = this
      setTimeout(() => {
        self.setState({placingAutoBid: false})
      }, 500)
    }
  }

  componentWillReceiveProps (props) {
    let product = props.product
    let bidPrice = this.state.bidPrice
    let autoBidPrice = this.state.autoBidPrice
    if (!product) return
    if (product.status === Const.PRODUCT_STATUS.BIDDING && product.round && product.round.bid_price > 0) {
      bidPrice = product.round.bid_price + product.step_price
    } else {
      bidPrice = product.start_price
    }
    if(!this.state.editingAutoBid && props.autoBids && props.autoBids[product.id]){
      autoBidPrice = props.autoBids[product.id].price
    }
    // let currentProductId = this.state.currentProductId
    // if(currentProductId === 0) currentProductId = product.id
    this.setState({bidPrice, autoBidPrice })
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
    if (this.state.placingBid) return
    this.setState({placingBid: true})
    SocketApi.emit('auction', {
      command: 'placeBid',
      product_id: this.props.product.id,
      bid_price: parseInt(this.state.bidPrice)
    })
  }

  placeAutoBid () {
    if (this.state.placingAutoBid) return
    this.setState({placingAutoBid: true, editingAutoBid: false})
    SocketApi.emit('auction', {
      command: 'placeAutoBid',
      product_id: this.props.product.id,
      auto_bid_price: parseInt(this.state.autoBidPrice)
    })
  }
  _renderAutobid (product, center = true) {
    let currentPrice = product.round ? product.round.bid_price : product.start_price
    return (
      <Row className={center ? 'just-center mt-3': ''}>
        <Col xs='auto' xl='auto' className='mb-1'>
          <UncontrolledTooltip placement="top" target="autoBidPrice">
            {this.props.t('auto_bid_placeholder')}
          </UncontrolledTooltip>
          <Input
            type='number'
            id='autoBidPrice'
            required
            valid={this.state.autoBidPrice >= currentPrice}
            invalid={this.state.autoBidPrice < currentPrice}
            value={this.state.autoBidPrice}
            onChange={(event) => {
              let autoBidPrice = parseInt(event.target.value) || 0
              this.setState({autoBidPrice, editingAutoBid: true})
            }} />
        </Col>
        <Col xl='auto' xs='auto'>
          <ConfirmButton size='l' color='danger' disabled={this.state.placingAutoBid} onClick={() => this.placeAutoBid()}><i className={`fa ${this.state.placingAutoBid ? 'fa-spinner fa-spin' : 'fa-shopping-basket'}`} /> {this.props.t('auto_bid_btn')} </ConfirmButton>
        </Col>
      </Row>
    )
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
      <Col xl={customCol} className='mb-3'>
        <Carousels items={items} renderCaption={product.status === Const.PRODUCT_STATUS.AUCTIONING || product.status === Const.PRODUCT_STATUS.BIDDING || product.status === Const.PRODUCT_STATUS.FINISHED} />
      </Col>
    )
  }
  _renderBidding (product) {
    const {t} = this.props
    let roundPrefix = {value: product.round ? product.round.num : 1, title: this.props.t('round')}
    return (
      <Row>
        {this._renderProductDetail(product, this.props.colOpen === '12' ? '4' : '6')}
        <Col xl={this.props.colOpen === '12' ? '4' : '6'}>
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
          {/* manual bid */}
          <Row className='just-center mt-3'>
            <Col xl='auto' xs='auto' className='ml-0 mr-1 pl-0 pr-0 float-right'>
              <Button outline color='danger' onClick={() => this.setState({bidPrice: this.state.bidPrice - product.step_price})} > <i className='fa fa-minus' /> </Button>
            </Col>
            <Col xs='auto' xl='4' lg='4' className='ml-0 mr-1 pl-0 pr-0'>
              <Input
                type='text'
                id='price'
                placeholder='Enter Bid Price'
                required
                value={this.state.bidPrice}
                disabled={this.state.placingBid}
                onChange={(event) => {
                  let bidPrice = parseInt(event.target.value) || 0
                  this.setState({bidPrice})
                }} />
            </Col>
            <Col xl='auto' xs='auto' className='ml-0 mr-0 pl-0 pr-0'>
              <Button outline color='success' onClick={() => this.setState({bidPrice: this.state.bidPrice + product.step_price})} > <i className='fa fa-plus' /> </Button>
            </Col>
            <Col xl='auto' xs='auto'>
              <ConfirmButton size='l' color='success' onClick={() => this.placeBid()} disabled={this.state.placingBid} ><i className={`fa ${this.state.placingBid ? 'fa-spinner fa-spin' : 'fa-shopping-basket'}`} /> {this.props.t('bid_btn')} </ConfirmButton>
            </Col>
          </Row>
          <Row className='mt-3'>
            <Col xl='12' className='img-ribbon'>
              <h3>{this.props.t('seller')} <img src={this._getBidder(product.seller_id).image_url} className='bidder_avatar' /> {this._getBidder(product.seller_id).name}</h3>
            </Col>
          </Row>
          {/* autobid */}
          {this._renderAutobid(product)}
        </Col>

        <Col xl={this.props.colOpen === '12' ? '4' : '6'}>
          <Row >
            <Col className='text-primary text-center '><h3 className='ribbon_top'>{t('top_bidders')}</h3> </Col>
          </Row>
          <ListGroup>
            {product.bids ? product.bids.map((bid, index) => {
              return (<ListGroupItem key={index}>
                <strong><img src={this._getBidder(bid.user_id).image_url} className='bidder_avatar' /> {bid.user_id === this.props.user.id ? 'You' : this._getBidder(bid.user_id).name}</strong>
                <strong className='float-right'>{this._renderCurrency(bid.bid_price)}</strong>
              </ListGroupItem>)
            }) : (<ListGroupItem className='text-danger text-center'>
              {t('take_first_bid')}
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
        <Col xl={this.props.colOpen === '12' ? '4' : '4'}>
          <ListGroup>
          <ListGroupItem color='info'>
            {/* autobid */}
            {this._renderAutobid(product, false)}
          </ListGroupItem>
            <ListGroupItem color='danger'>
              <Row>
                <Col> {this.props.t('seller')} <h3> <img src={this._getBidder(product.seller_id).image_url} className='bidder_avatar' /> {this._getBidder(product.seller_id).name}</h3></Col>
              </Row>
            </ListGroupItem>
            <ListGroupItem color='success'>
              <Row>
                <Col> {this.props.t('start')} <h3>{moment(product.start_at * 1000).format('YYYY/MM/DD HH:mm')}</h3></Col>
              </Row>
            </ListGroupItem>
            <ListGroupItem color='secondary'>
              <Row>
                <Col> {this.props.t('start_price')} <h3> {this._renderCurrency(product.start_price)}</h3></Col>
                <Col> {this.props.t('minimum_step')}<h3> {this._renderCurrency(product.step_price)}</h3></Col>
              </Row>
            </ListGroupItem>
            <ListGroupItem color='light'>
              <Row>
                {product.images.map(image => <ListGroupItemText key={image.id} className='mb-0'> {image.caption} </ListGroupItemText>)}
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
    if (this.props.colOpen === '12') {
      return (
        <Row>
          <Col xl='6' style={{paddingTop: 40}} className='text-center just-center'>
            {product.winner_id ? <Col className='sold-ribbon' /> : ('')}
            {this._renderProductDetail(product, 12)}
          </Col>
          <Col xl='6' xs='12' >
            <Row className='text-center just-center circle-ribbon'>
              <div className='text-white' style={{paddingTop: '2em', fontSize: '1.5em', height: 66, width: 145}}>
                {this._getBidder(product.winner_id).name}
              </div>
              <Col xl='12' className='text-white' style={{fontSize: '1.5em'}}>
                {this._renderCurrency(product.win_price || 0)}
              </Col>
            </Row>
            <Row className='mt-3'>
              <Col xl='12' className='img-ribbon'>
                {this.props.t('seller')} <img src={this._getBidder(product.seller_id).image_url} className='bidder_avatar' /> {this._getBidder(product.seller_id).name}
              </Col>
            </Row>
          </Col>
        </Row>
      )
    }
    return (
      <Row>
        <Col xl='12' >
          {product.winner_id ? <Col className='sold-ribbon' /> : ('')}
          <Row className='text-center just-center circle-ribbon'>
            <div className='text-white' style={{paddingTop: '2em', fontSize: '1.5em', height: 66, width: 145}}>
              {this._getBidder(product.winner_id).name}
            </div>
            <Col xl='12' className='text-white' style={{fontSize: '1.5em'}}>
              {this._renderCurrency(product.win_price || 0)}
            </Col>
          </Row>
          <Row className='mt-3'>
            <Col xl='12' className='img-ribbon'>
              {this.props.t('seller')} <img src={this._getBidder(product.seller_id).image_url} className='bidder_avatar' /> {this._getBidder(product.seller_id).name}
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
    let user = this.props.users && this.props.users[userId] ? this.props.users[userId] : {}
    return {
      name: user.name || '...',
      image_url: user.image_url || pLogo
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
    let roundPrefix = {value: product.round ? product.round.num : 1, title: this.props.t('round')}
    let productInfo
    let otherInfo
    let isBidDisable = this.state.placingBid
    let topColor = 'danger'
    let renderProductInfo = (col = 'auto', tagH5 = true) => {
      return (
        <Col xl={col} xs={col} onClick={() => this.setState({currentProductId: this.state.currentProductId ? 0 : product.id})} className='pl-1 pr-1'>
          <Badge className={`ml-2 ${tagH5 ? 'pt-2' : ''}`} color={this._color(product.category)} > {tagH5 ? (<h5> {product.category} </h5>) : product.category}</Badge>
          <Badge className={`ml-2 mr-2 ${tagH5 ? 'pt-2' : ''}`} color={'dark'} > {tagH5 ? (<h5> {product.ams_code} </h5>) : product.ams_code}</Badge>
          <Badge className={`mr-2 ${tagH5 ? 'pt-2' : ''}`} color={'light'} > {tagH5 ? (<h5> {product.name} </h5>) : product.name}</Badge>
        </Col>
      )
    }
    productInfo = renderProductInfo(12)
    if (!this.state.currentProductId) {
      if (product.round && product.round.bidder === this.props.user.id) {
        topColor = 'success'
        isBidDisable = true
      }
      if (product.status === Const.PRODUCT_STATUS.BIDDING || product.status === Const.PRODUCT_STATUS.AUCTIONING) {
        let currentPrice = product.round ? product.round.bid_price : product.start_price
        productInfo = renderProductInfo()
        otherInfo = (<Col style={{width: 270, display: 'flex', justifyContent: 'flex-end'}} className='pr-1 pl-1' >
          {product.round ? (<CountdownTimer mini autostart end={product.round.end_at} prefix={roundPrefix} />)
            : (<CountdownTimer mini autostart={false} duration={parseInt(product['round_time_1'])} prefix={roundPrefix} />)}
            
          <Badge color={'light'} className='pt-2' ><h5 className={'text-' + topColor}>{this._renderCurrency(currentPrice)}</h5></Badge>
          {this.state.autoBidPrice >= currentPrice ? <Badge color='success' className='pt-3'>{this.props.t('auto_bid_working')} {this._renderCurrency(this.state.autoBidPrice)} </Badge> : ('')}
          <Button outline className='ml-3' color={isBidDisable ? 'secondary' : 'success'} onClick={(event) => {
            event.stopPropagation()
            this.placeBid()
          }} disabled={isBidDisable} >
            <i className={`fa ${this.state.placingBid ? 'mr-1 fa-spinner fa-spin' : 'mr-1 fa-shopping-basket'}`} />
            {this._renderCurrency(this.state.bidPrice) }
          </Button>
        </Col>)
      } else if (product.status === Const.PRODUCT_STATUS.WAITING) {
        productInfo = renderProductInfo()
        otherInfo = (
          <Col style={{width: 270, display: 'flex', justifyContent: 'flex-end'}} className='pr-1 pl-1' onClick={() => this.setState({currentProductId: !this.state.currentProductId})}>
            <Badge color='success' className='mr-2 pt-2' ><h5>{moment(product.start_at * 1000).format('YYYY/MM/DD HH:mm')}</h5></Badge>
            {this.state.autoBidPrice ? <Badge color='success' className='pt-2'> <h5>{this.props.t('auto_bid_working')} {this._renderCurrency(this.state.autoBidPrice)} </h5></Badge> : <Badge color='info' className='mr-2 pt-2'> <h5> {this._renderCurrency(product.start_price)} </h5></Badge>}
          </Col>
        )
      } else if (product.status === Const.PRODUCT_STATUS.FINISHED) {
        productInfo = renderProductInfo('auto', false)
        otherInfo = (
          <Col style={{width: 270, display: 'flex', justifyContent: 'flex-end'}} className='pr-1 pl-1' onClick={() => this.setState({currentProductId: !this.state.currentProductId})}>
            <Badge color={product.winner_id === this.props.user.id ? 'success' : 'danger'}>{this._getBidder(product.winner_id).name } </Badge>
            <Badge color='danger'>{this._renderCurrency(product.win_price || 0)}</Badge>
          </Col>
        )
      }
    }
    return (
      <CardHeader onClick={() => this.setState({currentProductId: this.state.currentProductId ? 0 : product.id})}>
        <Row>
          {productInfo}
          {otherInfo}
        </Row>
      </CardHeader>

    )
  }
  render () {
    let product = this.props.product
    let bidPanel
    switch (product.status) {
      case Const.PRODUCT_STATUS.AUCTIONING:
      case Const.PRODUCT_STATUS.BIDDING:
        bidPanel = this._renderBidding(product)
        break
      case Const.PRODUCT_STATUS.FINISHED:
        bidPanel = this._renderFinished(product)
        break
      default:
        bidPanel = this._renderWaiting(product)
    }
    return (
      <Col xl={this.state.currentProductId ? this.props.colOpen || '6' : this.props.colCollapse || 6} className='animated fadeIn fadeOut'>
        <Card>
          {this._renderHeader(product)}
          <Collapse isOpen={this.state.currentProductId === product.id} data-parent='#accordion' id='collapseOne' aria-labelledby='headingOne'>
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
    users: state.bidder.data,
    autoBids: state.autoBid.data
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default translate('translations')(connect(mapStateToProps, mapDispatchToProps)(BiddingProductItem))
