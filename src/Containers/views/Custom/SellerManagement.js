import React, { Component } from 'react'
import { Badge, Col, Row, FormGroup, Input, Label, Button, Card, CardHeader } from 'reactstrap'
import { connect } from 'react-redux'
import SocketApi from '../../../Services/SocketApi'
import Utils from '../../../Utils/Utils'
import SellerProduct from './Components/SellerProduct'
import InfiniteScrollList from './Components/InfiniteScrollList'
import Alert from 'react-s-alert'
import moment from 'moment'
import NumberFormat from 'react-number-format'
import {translate} from 'react-i18next'
import SellerActions from '../../../Redux/SellerRedux'
import ReactExport from 'react-data-export'
const ExcelFile = ReactExport.ExcelFile
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet
const SAMPLE = {
  products: [
    {
      columns: [ 'id', 'name', 'category', 'ams_code', 'start_at', 'start_price', 'step_price', 'round_time_1', 'round_time_2', 'round_time_3' ],
      data: [
          ['1', 'Samsung Galaxy S', 'Phone', 'AMS-1078', '2018/08/03 12:30:00', '10000', '1000', '70', '120', '60'],
          ['2', 'ipod touch gen4 8GB', 'Phone', 'VN375', '2018/08/03 12:30:00', '10000', '1000', '70', '120', '60']
      ]
    }
  ],
  product_images: [
    {
      columns: ['product_id', 'src', 'caption'],
      data: [
        ['1', 'https://punch-auction.herokuapp.com/static/media/Punch_Logo.e53b4a96.png', 'Purchasing date:2013']
      ]
    }
  ]
}

class SellerManagement extends Component {
  constructor (props) {
    super(props)
    this.state = {
      opening: -1,
      file: null,
      products: []
    }
    this.toggle = this.toggle.bind(this)
    this._processServerMessage = this._processServerMessage.bind(this)
    this._handleFileUpload = this._handleFileUpload.bind(this)
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
      Alert.info(this.props.t(data.msg, data.msgParams), {
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
    SocketApi.removeAllListener('seller_message')
  }
  _renderCurrency (value) {
    return <NumberFormat value={value} displayType={'text'} thousandSeparator prefix={'đ'} />
  }
  _handleFileUpload (event) {
    // const file = files[0]
    this.setState({file: event.target.files[0]})

    // this.props.actions.uploadRequest({
    //   file,
    //   name: 'Awesome Cat Pic'
    // })
  }
  componentWillReceiveProps (props) {
    if (props.error) {
      Alert.error(this.props.t(props.error), {
        position: 'bottom-right',
        effect: 'bouncyflip'
      })
    }
    if (props.sellerProducts) {
      Alert.info(this.props.t('imported_products', {num: props.sellerProducts.length}), {
        position: 'bottom-right',
        effect: 'bouncyflip'
      })
      this.setState({products: Utils.clone(props.sellerProducts)})
    }
  }
  _import () {
    this.props.request({
      command: 'import',
      file: this.state.file
    })
  }
  _render () {
    return (
      <div className='animated fadeIn pl-0 pr-0'>
        <Row>
          <Col xl='12'>
            <Card>
              <CardHeader>
                {this.props.fetching ? 'Importing...'
              : <Row>
                <Col xs='12' md='auto'>
                  <ExcelFile element={<Button color='success' >{this.props.t('sample')}</Button>}>
                    <ExcelSheet dataSet={SAMPLE.products} name='products' />
                    <ExcelSheet dataSet={SAMPLE.product_images} name='product_images' />
                  </ExcelFile>
                  <Button className='ml-3' color='success' onClick={() => this._import()} disabled={!this.state.file}> {this.props.t('import')} </Button>
                </Col>
                <Col xs='12' md='auto'>

                  <Input type='file'onChange={this._handleFileUpload} accept='.xls,.xlsx' style={{position: 'absolute', opacity: 0}} />
                  <Button className='mr-3' color='success' onClick={() => this._import()}><i className='fa fa-cloud-upload' /> {this.state.file ? this.state.file.name : this.props.t('import_from_excel')} </Button>
                </Col>

              </Row>
              }
              </CardHeader>
            </Card>
          </Col>
        </Row>
        <Row>
          <SellerProduct header={this.props.t('add_auction_product')} index={-2} toggle={this.toggle} opening={this.state.opening === -2} />
        </Row>
        <InfiniteScrollList ref='scrollList'
          items={this.state.products}
          endText={this.props.t('read_em_all')}
          renderItem={(product, index) => <SellerProduct
            key={product.id}
            header={(<Row>
              <Col xl='12'>
                <Badge color='info'>{product.id}</Badge>
                <Badge color='danger'>{product.category}</Badge>
                <Badge color='warning'>{product.ams_code}</Badge>
                <Badge color='primary'>{moment(product.start_at * 1000).format('YYYY/MM/DD HH:mm')}</Badge>
                <Badge color='success'>{this._renderCurrency(product.start_price)}</Badge>
                <Badge color='success'>+{this._renderCurrency(product.step_price)}</Badge>
                <Badge color={product.status ? 'success' : 'dark'}>{product.status ? 'WAITING' : 'HIDDEN'}</Badge>
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
        : (<h3> {this.props.t('unauthorized')} </h3>)
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.login.data,
    fetching: state.seller.fetching,
    error: state.seller.error,
    sellerProducts: state.seller.data
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    request: (params) => dispatch(SellerActions.sellerRequest(params))
  }
}

export default translate('translations')(connect(mapStateToProps, mapDispatchToProps)(SellerManagement))
