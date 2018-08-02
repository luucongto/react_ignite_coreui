const {SocketApiClass} = require('../src/Services/SocketApi')

class Client {
  constructor (index, token) {
    this.index = index
    this.client = new SocketApiClass()
    this.client.setup(token)
    this.data = []
    console.log('Setup client: ', index)
    this._setupSocket()
    this.run()
  }
  placeBid () {
    let self = this
    if (!self.data.length) return
    let product = self.data[Math.floor(Math.random() * self.data.length)]
    if (product.round && product.round.bid_price && product.round.bid_price + product.step_price > product.start_price * 20){
      return
    }
    this.client.emit('auction', {
      command: 'placeBid',
      product_id: product.id,
      bid_price: product.round && product.round.bid_price ? product.round.bid_price + product.step_price : product.start_price
    })
  }
  _setupSocket () {
    let self = this
    this.client.on('auction', data => {
      self.data = data.filter(product => product.status === 'bidding')
    })
  }
  run () {
    let self = this
    let timeout = parseInt(Math.random() * 100000)
    setTimeout(() => {
      self.placeBid()
      self.run()
    }, timeout)
  }
}

module.exports = Client
