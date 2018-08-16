import Client from './client'
import userTokens from './userTokens'
import ApiConfig from '../src/Config/ApiConfig'
let clients = []
console.log('ApiConfig.baseURL', ApiConfig.baseURL)
let num = process.env.TEST_NUM || 100
for (var i = 0; i < num; i++) {
  let client = new Client(i, userTokens[i])
  clients.push(client)
}
