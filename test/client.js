
const {SocketApiClass} = require('../src/Services/SocketApi')

class Client {
  constructor (index, token) {
    this.index = index
    this.client = new SocketApiClass()
    this.client.setup(token)
    this.data = []
    console.log('Setup client: ', index)
    this.run()
  }
  updateData(data){
    this.data = data
  }
  placeBid () {
    let self = this
    if (!self.data.length) return
    let product = self.data[Math.round(Math.random() * self.data.length)]
    if (product.round && product.round.bid_price && product.round.bid_price + product.step_price > product.start_price * 20) {
      return
    }
    this.client.emit('auction', {
      command: 'placeBid',
      product_id: product.id,
      bid_price: product.round && product.round.bid_price ? product.round.bid_price + product.step_price : product.start_price
    })
  }
  
  run () {
    let self = this
    let timeout = parseInt(Math.random() * 20000)
    setTimeout(() => {
      self.placeBid()
      self.run()
    }, timeout)
  }
}

module.exports = Client
