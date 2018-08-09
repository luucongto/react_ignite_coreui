import React, { Component } from 'react'
import { Badge, Col, Row } from 'reactstrap'
import { connect } from 'react-redux'
import SocketApi from '../../../Services/SocketApi'
import Utils from '../../../Utils/Utils'
import SellerProduct from './Components/SellerProduct'
import InfiniteScrollList from './Components/InfiniteScrollList'
import Alert from 'react-s-alert'
import moment from 'moment'
import NumberFormat from 'react-number-format'
class SellerManagement extends Component {
  constructor (props) {
    super(props)
    this.state = {
      opening: -1,
      products: []
    }
    this.toggle = this.toggle.bind(this)
    this._processServerMessage = this._processServerMessage.bind(this)
  }
  toggle (index) {
    this.setState({opening: this.state.opening === index ? -1 : index})
  }
  _processServerMessage (data) {
    let self = this
    if (data.success && data.products) {
      self.setState({products: data.products})
    }
    if (data.success && data.product) {
      let products = Utils.clone(this.state.products)
      products = products.map(product => product.id !== data.product.id ? product : data.product)
      self.setState({products})
    }
    if (data.success && data.destroy) {
      let products = Utils.clone(this.state.products)
      let product = products.find(product => product.id === data.destroy)
      let index = products.indexOf(product)
      if (index >= 0) {
        products.splice(index, 1)
      }
      self.setState({products})
    }
    if (data.msg) {
      Alert.info(data.msg, {
        position: 'bottom-right',
        effect: 'bouncyflip'
      })
    }
  }
  componentDidMount () {
    SocketApi.emit('seller', {command: 'seller_get'})
    SocketApi.on('seller_message', this._processServerMessage)
  }
  componentWillUnmount () {
    SocketApi.removeAllListener('seller_message', this._processServerMessage)
  }
  _renderCurrency (value) {
    return <NumberFormat value={value} displayType={'text'} thousandSeparator prefix={'đ'} />
  }
  _render () {
    return (
      <div className='animated fadeIn pl-0 pr-0'>
        <Row>
          <SellerProduct header='Add Auction Product' index={-2} toggle={this.toggle} opening={this.state.opening === -2} />
        </Row>
        <InfiniteScrollList ref='scrollList'
          items={this.state.products}
          renderItem={(product, index) => <SellerProduct
            key={product.id}
            header={(<Row>
              <Col xl='12'>
                <Badge color='info'>{product.id}</Badge>
                <Badge color='danger'>{product.category}</Badge>
                <Badge color='warning'>{product.ams_code}</Badge>
                <Badge color='primary'>{moment(product.start_at).format('YYYY/MM/DD HH:MM')}</Badge>
                <Badge color='success'>{this._renderCurrency(product.start_price)}</Badge>
                <Badge color='success'>+{this._renderCurrency(product.step_price)}</Badge>
                <Badge color='light'>{product.name}</Badge>
              </Col>
            </Row>)}
            product={product}
            index={product.id}
            toggle={this.toggle}
            opening={this.state.opening === product.id} />}
        />
      </div>
    )
  }
  render () {
    return this.props.user.isSeller ? this._render()
        : (<h3> Unauthorized </h3>)
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.login.data
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SellerManagement)
