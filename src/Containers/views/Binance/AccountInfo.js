import React, { Component } from 'react'
import { Card, CardBody, CardHeader, Col, Row, ListGroup, ListGroupItem, Progress, Badge } from 'reactstrap'
import { connect } from 'react-redux'
import AccountInfoActions from '../../../Redux/AccountInfoRedux'
import Alert from 'react-s-alert'
import NumberFormat from 'react-number-format'
class AccountInfo extends Component {
  constructor (props) {
    super(props)
    this.props.request()
  }
  componentWillReceiveProps (props) {
    if (props.error) {
      Alert.error(props.error, {
        position: 'bottom-right',
        effect: 'bouncyflip'
      })
    }
  }
  _renderOverview () {
    let bidNum = 0
    let totalPurcharsed = 0
    if (this.props.accountInfo.products) {
      bidNum = this.props.accountInfo.products.length
      this.props.accountInfo.products.forEach(product => {
        totalPurcharsed += product.win_price
      })
    }

    return (
      <ListGroup>
        <ListGroupItem color='secondary'>
          <Row>
            <Col> Total Win Items <h3> {bidNum}</h3></Col>
            <Col> Total Purcharsed <h3> <NumberFormat value={totalPurcharsed} displayType={'text'} thousandSeparator prefix={'VND'} /></h3></Col>
          </Row>
        </ListGroupItem>
      </ListGroup>
    )
  }
  _renderProductDetail (product) {
    return (<Col xl={this.props.col === '12' ? '4' : '6'} className='mb-3'>
      <ListGroup>
        <ListGroupItem color='primary'>
          {product.detail}
        </ListGroupItem>
        <ListGroupItem color='secondary'>
          <Row>
            <Col> Start Price <h3> <NumberFormat value={product.start_price} displayType={'text'} thousandSeparator prefix={'VND'} /></h3></Col>
            <Col> Minimum Step <h3> <NumberFormat value={product.step_price} displayType={'text'} thousandSeparator prefix={'VND'} /></h3></Col>
          </Row>
        </ListGroupItem>
      </ListGroup>
    </Col>
    )
  }
  _renderFinished (product) {
    return (
      <Row>
        {this._renderProductDetail(product)}
        <Col xl={this.props.col === '12' ? '4' : '6'} style={{zIndex: 1, paddingLeft: 50}}>
          <Row className='text-center ribbon-container'>
            <Col className='ribbon'>
              <div class='ribbon-stitches-top' />
              <strong class='ribbon-content'>
                <h1><NumberFormat value={product.win_price} displayType={'text'} thousandSeparator prefix={'VND'} /></h1>
              </strong>
              <div class='ribbon-stitches-bottom' />
            </Col>
          </Row>
        </Col>
      </Row>
    )
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
        return 'primary'
      case 'Keyboard':
        return 'primary'
      default:
        return 'light'
    }
  }
  _renderProduct (product) {
    return (
      <Col xl={this.props.col || '6'}>
        <Card>
          <CardHeader>
            <Badge color={this._color(product.category)} > {product.category} </Badge>
            <Badge className='ml-2 mr-2' color={'dark'} > {product.ams_code} </Badge>
            {product.name}
          </CardHeader>
          <CardBody>
            {
                this._renderFinished(product)
              }
          </CardBody>
        </Card>
      </Col>
    )
  }
  _renderProducts () {
    if (!this.props.accountInfo.products) {
      return ('')
    }
    return (
      this.props.accountInfo.products.map(product => this._renderProduct(product))
    )
  }
  render () {
    return this.props.fetching ? (<Progress animated color='danger' value='100' />)
      : (
        <div className='animated fadeIn'>
          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <i className='fa fa-align-justify' /> Overview
                </CardHeader>
                <CardBody >
                  {this._renderOverview()}
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            {this._renderProducts()}
          </Row>
        </div>

      )
  }
}
const mapStateToProps = (state) => {
  return {
    accountInfo: state.accountInfo.data,
    fetching: state.accountInfo.fetching,
    error: state.accountInfo.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    request: () => dispatch(AccountInfoActions.accountInfoRequest())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountInfo)
