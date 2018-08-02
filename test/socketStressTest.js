import Client from './client'
import userTokens from './userTokens'
let clients = []
for (var i = 0; i < 100; i++) {
  let client = new Client(i, userTokens[i])
  clients.push(client)
}
