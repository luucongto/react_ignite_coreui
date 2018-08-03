import React, { Component } from 'react'
import { Card, CardBody, CardHeader, Col, Row, ListGroup, ListGroupItem, Progress, Badge } from 'reactstrap'
import { connect } from 'react-redux'
import AccountInfoActions from '../../../Redux/AccountInfoRedux'
import Alert from 'react-s-alert'
import NumberFormat from 'react-number-format'
import BaseProducts from './Components/BaseProducts'
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
    let products = this.props.accountInfo && this.props.accountInfo.products ? Object.values(this.props.accountInfo.products) : []
    if (products.length) {
      bidNum = products.length
      products.forEach(product => {
        totalPurcharsed += product.win_price
      })
    }

    return (
      <ListGroup>
        <ListGroupItem color='secondary'>
          <Row>
            <Col> Total Win Items <h3> {bidNum}</h3></Col>
            <Col> Total Purcharsed <h3> <NumberFormat value={totalPurcharsed} displayType={'text'} thousandSeparator prefix={'đ'} /></h3></Col>
          </Row>
        </ListGroupItem>
      </ListGroup>
    )
  }
  _renderProducts () {
    if (!this.props.accountInfo.products) {
      return ('')
    }
    return (
      <BaseProducts title='Sold Products' filterStatus='finished' colLength={4} products={this.props.accountInfo.products} />
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
