import React, { Component } from 'react'
import { Card, CardBody, CardHeader, Col, Row, ListGroup, ListGroupItem, Progress, Badge,
  CardFooter,
  FormGroup,
  Label,
  Input
  } from 'reactstrap'
import { connect } from 'react-redux'
import AccountInfoActions from '../../../Redux/AccountInfoRedux'
import Alert from 'react-s-alert'
import NumberFormat from 'react-number-format'
import BaseProducts from './Components/BaseProducts'
import {translate} from 'react-i18next'
import Const from '../../../Config/Const'
import ConfirmButton from './Components/ConfirmButton'
class AccountInfo extends Component {
  constructor (props) {
    super(props)
    this.state = {
      password: '',
      confirmPassword: ''
    }
    this.props.request()
  }
  componentWillReceiveProps (props) {
    if (props.error) {
      Alert.error(this.props.t(props.error), {
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
            <Col> {this.props.t('total_win_items')} <h3> {bidNum}</h3></Col>
            <Col> {this.props.t('total_purcharsed')} <h3> <NumberFormat value={totalPurcharsed} displayType={'text'} thousandSeparator prefix={'đ'} /></h3></Col>
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
      <BaseProducts title={this.props.t('sold_products')} filterStatus={[Const.PRODUCT_STATUS.FINISHED]} colLength={4} products={this.props.accountInfo.products} />
    )
  }

  updatePassword () {
    this.props.request({
      command: 'update',
      password: this.state.password
    })
  }
  render () {
    return this.props.fetching ? (<Progress animated color='danger' value='100' />)
      : (
        <div className='animated fadeIn'>
          <Row>
            <Col xl='6' md='12'>
              <Card>
                <CardHeader>
                  <i className='fa fa-align-justify' /> {this.props.t('changePassword')}
                </CardHeader>
                <CardBody >
                  <Row>
                    <Col xl='auto'>
                      <FormGroup row>
                        <Col md='auto'>
                          <Label htmlFor='password-input'>{this.props.t('password')}</Label>
                        </Col>
                        <Col xs='12' md='auto'>
                          <Input type='password' id='password-input' name='password-input' placeholder={this.props.t('noChange')} autoComplete='new-password' value={this.state.password} onChange={(event) => this.setState({password: event.target.value})} />
                        </Col>
                      </FormGroup>
                    </Col>
                    <Col xl='auto'>
                      <FormGroup row>
                        <Col md='auto'>
                          <Label htmlFor='password-input'>{this.props.t('confirmPassword')}</Label>
                        </Col>
                        <Col xs='12' md='auto'>
                          <Input type='password' id='confirm-password-input' name='confirm-password-input' placeholder={this.props.t('noChange')} autoComplete='new-password' value={this.state.confirmPassword} onChange={(event) => this.setState({confirmPassword: event.target.value})} />
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <ConfirmButton size='l' color='success' onClick={() => this.updatePassword()} disabled={!this.state.password || this.state.password.length === 0 || this.state.password !== this.state.confirmPassword} ><i className={`fa ${this.state.fetching ? 'fa-spinner fa-spin' : 'fa-check'}`} /> {this.props.t('btn_update')} </ConfirmButton>
                </CardFooter>
              </Card>
            </Col>
            <Col xl='6' md='12'>
              <Card>
                <CardHeader>
                  <i className='fa fa-align-justify' /> {this.props.t('overview')}
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
    request: (params) => dispatch(AccountInfoActions.accountInfoRequest(params))
  }
}

export default translate('translations')(connect(mapStateToProps, mapDispatchToProps)(AccountInfo))
