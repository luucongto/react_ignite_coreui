import React, { Component } from 'react'
import { Badge, Button, Card, CardBody, CardHeader, Col, Row, Table, Progress, Collapse } from 'reactstrap'
import { connect } from 'react-redux'
import OpenOrdersActions from '../../../../Redux/OpenOrdersRedux'
import moment from 'moment'
import {AppSwitch} from '@coreui/react'
import io from 'socket.io-client'
import ApiConfig from '../../../../Config/ApiConfig'
import SocketApi from '../../../../Services/SocketApi'
import Utils from '../../../../Utils/Utils'
class OpenOrders extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showDoneOrder: false,
      showOrder: true,
      showAuto: true,
      showTest: false,
      openOrders: [],
      doneOrders: [],
    }
    this._setupSocket()
  }

  _setupSocket () {
    let self = this
    SocketApi.on('update_order', data => {
      self.props.updateOrder(data)
    })
    SocketApi.emit('update_order', {
      command: 'refresh'
    })
  }

  holdOrder (orderId) {
    SocketApi.emit('update_order',{
      command: 'updateOrder',
      status: 'hold',
      id: orderId
    })
  }
  cancelOrder (orderId) {
    console.log("Press cancel")
    SocketApi.emit('update_order',{
      command: 'updateOrder',
      status: 'cancel',
      id: orderId
    })
  }
  resumeOrder (orderId) {
    SocketApi.emit('update_order',{
      command: 'updateOrder',
      status: 'watching',
      id: orderId
    })
  }
  componentWillReceiveProps(props){
    let openOrders = []
    let doneOrders = []
    if(props.openOrders){
      let orders = JSON.parse(JSON.stringify(props.openOrders))
      openOrders = orders.filter(e => (e.status !== 'done' && e.status !== 'cancel') ).sort((a, b) => a.pair > b.pair).sort((a,b) => a.updatedAt > b.updatedAt)
      doneOrders = orders.filter(e => (e.status === 'done')).sort((a,b) => a.updatedAt > b.updatedAt).sort((a, b) => a.pair < b.pair)
      this.setState({openOrders, doneOrders})
    }
  }
  _filterStatus(openOrders){
    let status = {
      'done': 0,
      'watching': 0,
      'waiting': 0,
      'manual': 0,
      'auto': 0,
      'buy': 0,
      'sell': 0,
      'TEST': 0,
      'REAL': 0
    }
    openOrders.forEach(order => {
      status[order.status]++
      if(order.balance_id) status.auto++
      else status.manual ++
      status[order.type]++
      status[order.mode]++
    });
    return status
  }
  _getButton (element) {
    switch (element.status) {
      case 'watching':
        return (<Button className='ml-3' onClick={() => this.holdOrder(element.id)} active> Hold </Button>)
      case 'hold':
        return (<Button className='ml-3' onClick={() => this.resumeOrder(element.id)} active> Resume </Button>)
    }
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
            {/* <th> id </th> */}
            <th> pair </th>
            <th> 
              <Badge color={'light'}> Price </Badge> 
              <Badge color={'dark'}> Expect </Badge>
              <Badge color={'info'}> Offset </Badge>
            </th>
            <th> Estimate </th>
            <th> mode 
              

            </th>
            {/* <th> createdAt </th> */}
            <th> status </th>

          </tr>
        </thead>
        <tbody>
          {
            orders.map(element => {
              let total = element.quantity * element.price
              let expectTotal = element.quantity * element.expect_price
              let percent = (total / expectTotal*100 - 100).toFixed(2) 
              total = Utils.formatNumber(total)
              expectTotal = expectTotal > 10 ? expectTotal.toFixed(2): expectTotal.toFixed(4)
            return (
                <tr key={element.id} >
                  {/* <td> {element.id} </td> */}
                  <td>
                    <Badge color={'info'}> {Utils.formatNumber(element.quantity)} </Badge>
                    <Badge color={'light'}> {element.asset} </Badge>
                    <Badge color={'dark'}> {element.currency} </Badge>
                  </td>
                  <td>
                    <Badge color={'light'}> {Utils.formatNumber(element.price)} </Badge> 
                    <Badge color={'dark'}> {Utils.formatNumber(element.expect_price)} </Badge>
                    <Badge color={'info'}> {Utils.formatNumber(element.offset)} </Badge>
                  </td>
                  <td>
                    <Badge color={'light'}> { Utils.formatNumber(total)} </Badge> 
                    <Badge color={'dark'}> { Utils.formatNumber(expectTotal)} </Badge> 
                    <Badge color={(element.mode === 'buy' && percent <= 0) || (element.mode === 'sell' && percent >= 0) ? 'success' : 'danger'}> {percent}% </Badge> 
                  </td>
                  <td>
                    <Badge color={element.mode === 'buy' ? 'success' : 'danger'}> {element.mode} </Badge> 
                    <Badge color={element.type === 'TEST' ? 'success' : 'danger'}> {element.type} </Badge> 
                    <Badge color={element.balance_id > 0 ? 'primary' : 'secondary'}> {element.balance_id > 0 ? `Auto[${element.balance_id}]`:'Manual'} </Badge> 
                  </td>
                  
                  <td>
                    <Badge color={'light'}> {moment(element.updatedAt).format('MM/DD hh:mm')}  </Badge> 
                    
                    <Badge className='ml-3' color={this._color(element.status)}> {element.status} </Badge>
                    {
                      element.status === 'done' || element.status === 'cancel' ? ('') : (
                        <Button className='ml-3' onClick={() => this.cancelOrder(element.id)} active> Cancel </Button>
                      )
                    }
                    { this._getButton(element) }
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
    let openOrders = this.state.openOrders
    let doneOrders = this.state.doneOrders
    let status = this._filterStatus(openOrders)
    let doneStatus = this._filterStatus(doneOrders)
    if(!this.state.showAuto){
      openOrders = openOrders.filter(order => !order.balance_id)
      doneOrders = doneOrders.filter(order => !order.balance_id)
    }
    if(!this.state.showTest){
      openOrders = openOrders.filter(order => order.type !== 'TEST')
      doneOrders = doneOrders.filter(order => order.type !== 'TEST')
    }
    return (
      <div className='animated fadeIn'>
        <Row>
          <Col>
            <Card>
              <CardHeader  onClick={() => this.setState({showOrder: !this.state.showOrder})}>
                <i className='fa fa-align-justify' /> Orders
                Connection: 
                <Badge className="ml-3" color={SocketApi.connectionStatus === 'connect' ? 'success' : 'danger'}> {SocketApi.connectionStatus}</Badge>
                <Badge className="ml-3" color='primary'> Auto {status.auto}</Badge>
                <Badge className="ml-3" color='secondary'> Manual {status.manual}</Badge>
                <Badge className="ml-3" color='success'> TEST {status.TEST} </Badge>
                  
                
                <Badge className="ml-3" color='danger'> REAL {status.REAL}</Badge>
                <Badge className="ml-3" color='warning'> Waiting {status.waiting}</Badge>
                <Badge className="ml-3" color='success'> Watching {status.watching}</Badge>
                <Badge className="ml-3" color='success'> Buy {status.buy}</Badge>
                <Badge className="ml-3" color='danger'> Sell {status.sell}</Badge>
                <a className=" float-right mb-0 card-header-action btn btn-minimize"><i className={this.state.showOrder ? "icon-arrow-up" : "icon-arrow-down"}></i></a>
                
                <AppSwitch className={'ml-1 mr-3 mb-0 float-right '} label color={'success'} defaultChecked={this.state.showTest} size={'sm'} onClick={() => this.setState({showTest: !this.state.showTest})} />
                <strong  className='float-right'> Show Test </strong>
                <AppSwitch className={'ml-1 mr-3  mb-0 float-right'} label color={'info'} defaultChecked={this.state.showAuto} size={'sm'} onClick={() => this.setState({showAuto: !this.state.showAuto})}/>
                <strong  className='float-right'> Auto </strong>
              </CardHeader>
              <Collapse isOpen={this.state.showOrder} id="collapseExample">
              <CardBody>
                {this._renderTable(openOrders)}
              </CardBody>
              </Collapse>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card>
              <CardHeader onClick={() => this.setState({showDoneOrder: !this.state.showDoneOrder})}>
                <i className='fa fa-align-justify' /> Completed Orders
                <Badge className="ml-3" color='primary'> Done {doneStatus.done}</Badge>
                <Badge className="ml-3" color='primary'> Auto {doneStatus.auto}</Badge>
                <Badge className="ml-3" color='secondary'> Manual {doneStatus.manual}</Badge>
                <Badge className="ml-3" color='success'> TEST {doneStatus.TEST}</Badge>
                <Badge className="ml-3" color='danger'> REAL {doneStatus.REAL}</Badge>
                <Badge className="ml-3" color='warning'> Waiting {doneStatus.waiting}</Badge>
                <Badge className="ml-3" color='success'> Watching {doneStatus.watching}</Badge>
                <Badge className="ml-3" color='success'> Buy {doneStatus.buy}</Badge>
                <Badge className="ml-3" color='danger'> Sell {doneStatus.sell}</Badge>
                <a className=" float-right mb-0 card-header-action btn btn-minimize"><i className={this.state.showDoneOrder ? "icon-arrow-up" : "icon-arrow-down"}></i></a>
              </CardHeader>
              <Collapse isOpen={this.state.showDoneOrder} id="collapseExample">
              <CardBody>
                {this._renderTable(doneOrders)}
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
    openOrders: state.openOrders.data,
    fetching: state.openOrders.fetching
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    request: (params) => dispatch(OpenOrdersActions.openOrdersRequest(params)),
    updateOrder: (data) => dispatch(OpenOrdersActions.openOrdersSuccess(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OpenOrders)
