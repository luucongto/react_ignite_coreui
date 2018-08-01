import React, { Component } from 'react'
import { Button, Row } from 'reactstrap'
import { connect } from 'react-redux'
import BidderAction from '../../../../Redux/BidderRedux'
import SocketApi from '../../../../Services/SocketApi'
import BiddingProductItem from './BiddingProductItem'
class FinishedProduct extends Component {
  constructor (props) {
    super(props)
    this.state = {
      products: [],
      accordion: {}
    }
  }

  refresh () {
    SocketApi.emit('auction', {
      command: 'refresh'
    })
  }
  placeBid (params) {
    SocketApi.emit('auction', {
      command: 'placeBid',
      ...params
    })
  }
  componentDidMount () {
    this._setupSocket()
  }
  _setupSocket () {
    let self = this
    SocketApi.on('auction', data => {
      console.log(data)
      let updatedIds = data.map(e => e.id)
      let unchangeProducts = this.state.products.filter(e => updatedIds.indexOf(e.id) < 0)
      let newData = [...unchangeProducts, ...data]
      self.setState({products: newData})
    })
    SocketApi.on('users', data => {
      self.props.updateBidders(data)
    })
    this.refresh()
  }

  _filterStatus (openOrders) {
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
      if (order.balance_id) status.auto++
      else status.manual ++
      status[order.type]++
      status[order.mode]++
    })
    return status
  }

  _getButton (element) {
    switch (element.status) {
      case 'watching':
        return (<Button color='warning' size='sm' className='ml-3' onClick={() => this.holdOrder(element.id)} active> <i className='fa fa-pause' /> </Button>)
      case 'hold':
        return (<Button color='success' size='sm' className='ml-3' onClick={() => this.resumeOrder(element.id)} active> <i className='fa fa-play' /> </Button>)
      default:
        return ''
    }
  }

  _renderBidding (products, colLength = '6') {
    return (
      <Row>
        {
        products.map((product, index) => <BiddingProductItem col={colLength} product={product} key={index} placeBid={(params) => this.placeBid(params)} />)
        }
      </Row>
    )
  }

  render () {
    let finished = this.state.products.filter(product => product.status === 'finished')
    return (
      <div className='animated fadeIn pl-0 pr-0'>
        {finished.length ? this._renderBidding(finished) : (<h3> There isn't any auctioning products </h3>)}
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    login: state.login.data
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateBidders: (bidders) => dispatch(BidderAction.bidderSuccess(bidders))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FinishedProduct)
