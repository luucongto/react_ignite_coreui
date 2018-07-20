
import React, { Component } from 'react'
import { Badge, Button, Card, CardBody, CardHeader, Col, Row, Table, Progress, Collapse } from 'reactstrap'
import { connect } from 'react-redux'
import AutoOrdersActions from '../../../../Redux/AutoOrdersRedux'
import moment from 'moment'
import ApiConfig from '../../../../Config/ApiConfig'
import SocketApi from '../../../../Services/SocketApi'
class AutoOrders extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showOrder: false
    }
    this._setupSocket()
  }

  _setupSocket () {
    let self = this
    SocketApi.on('auto_order', data => {
      self.props.updateOrder(data)
    })
    SocketApi.emit('auto_order', {command: 'refresh'})
  }

  
  cancelOrder (orderId) {
    SocketApi.emit('auto_order', {
      command: 'cancelOrder',
      id: orderId
    })
  }
  _color (status) {
    switch (status) {
      case 'watching':
        return 'success'
      case 'cancel':
        return 'danger'
      case 'waiting':
        return 'warning'
      case 'done':
        return 'info'
    }
  }
  _renderTable(orders){
    return !orders.length ? ('') : (
      <Table responsive size='sm'>
        <thead>
          <tr>
            <th> id </th>
            <th> currency </th>
            <th> asset </th>
            <th> offset </th>
            <th> strategy </th>
            <th> status </th>
          </tr>
        </thead>
        <tbody>
          {
            orders.map(element => {
            return (
                <tr key={element.id} >
                  <td> 
                  <Badge color={'primary'}> {element.id} </Badge></td>
                  <td>
                    <Badge color={'info'}> {element.currency_num > 10? element.currency_num.toFixed(2) : element.currency_num.toFixed(4)} </Badge>
                    <Badge color={'light'}> {element.currency} </Badge>
                  </td>
                  <td> 
                    <Badge color={'info'}> {element.asset_num > 10? element.asset_num.toFixed(2) : element.asset_num.toFixed(4)} </Badge>
                    <Badge color={'dark'}> {element.asset} </Badge>
                  </td>
                  <td>
                  <Badge color={'light'}> {element.offset} </Badge>
                  </td>
                  <td>
                    <Badge color={'primary'}> {element.strategy} </Badge>
                  </td>
                  <td>
                    <Row>
                      <Col xs='12' lg='4'>
                        <Badge color={this._color(element.status)}> {element.status} </Badge>
                      </Col>
                      {
                        element.status === 'watching' ?
                      (<Col xs='12' lg='4'>
                        <Button onClick={() => this.cancelOrder(element.id)} active> Cancel </Button>
                      </Col>) : ''
                      }
                    </Row>
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </Table>
    )
  }
  render () {
    let autoOrders = JSON.parse(JSON.stringify(this.props.autoOrders)).sort((a, b) => a.updatedAt < b.updatedAt)
    return (
      <div className='animated fadeIn'>
        <Row>
          <Col>
            <Card>
              <CardHeader onClick={() => this.setState({showOrder: !this.state.showOrder})}>
                <i className='fa fa-align-justify' /> Auto Order
                Connection: <Badge color={SocketApi.connectionStatus === 'connect' ? 'success' : 'danger'}> {SocketApi.connectionStatus}</Badge>
                <a className=" float-right mb-0 card-header-action btn btn-minimize"><i className={this.state.showOrder ? "icon-arrow-up" : "icon-arrow-down"}></i></a>
              </CardHeader>
              <Collapse isOpen={this.state.showOrder}>
                <CardBody>
                  {this._renderTable(autoOrders)}
                </CardBody>
              </Collapse>
            </Card>
          </Col>
        </Row>
      </div>

    )
  }
}
const mapStateToProps = (state) => {
  return {
    login: state.login.data,
    autoOrders: state.autoOrders.data,
    fetching: state.autoOrders.fetching
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateOrder: (data) => dispatch(AutoOrdersActions.autoOrdersSuccess(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AutoOrders)
