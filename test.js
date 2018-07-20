const apisauce = require('apisauce')
const api = apisauce.create({
  // base URL is read from the "constructor"
  baseURL: 'http://localhost:3333',
  // here are some default headers
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  // 15 second timeout...
  timeout: 15000
})

api.get('/').then(result => {
  console.log('/', result)
})

api.get('binance/accountInfo', {}, {headers: {'Authorization': 'jwt ' + 'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0IiwicGFzc3dvcmQiOiIkMmIkMTAkWXNWRmYzUFdPN3hyaC9xaTJBdWVCT203UFNaZ3JwQ01rbnJGQnFMZ09lNmhnWk5qc3B2ek8iLCJzb2NrZXRpZCI6bnVsbCwicm9vbXNvY2tldGlkIjpudWxsLCJjcmVhdGVkQXQiOm51bGwsInVwZGF0ZWRBdCI6bnVsbH0.Oe0aR3CneSNZv23mMZdP1xiu1yXve8uNX3Pz26viQX8'}}).then(result => {
  console.log('binance/accountInfo', result)
})