import Client from './client'
import userTokens from './userTokens'
import ApiConfig from '../src/Config/ApiConfig'
import Const from '../src/Config/Const'
let clients = []
console.log('ApiConfig.baseURL', ApiConfig.baseURL)
let num = process.env.TEST_NUM || 100
for (var i = 0; i < num; i++) {
  let client = new Client(i, userTokens[i])
  clients.push(client)
}
const {SocketApiClass} = require('../src/Services/SocketApi')
let socket = new SocketApiClass()
socket.setup(userTokens[0])
let _setupSocket = () => {
  let self = this
  socket.on('auction', data => {
    data = data.filter(product => product.status === Const.PRODUCT_STATUS.BIDDING || product.status === Const.PRODUCT_STATUS.AUCTIONING)
    clients.forEach(client => client.updateData(data))
  })
}

_setupSocket()