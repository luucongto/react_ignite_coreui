import ApiConfig from '../Config/ApiConfig'
import io from 'socket.io-client'
class SocketApi {
  constructor () {
    this.socket = null
    this.handlers = []
    this.isConnected = false
    this.serverTime = '...'
    this.serverRealApi = true
    this.onlineClients = 0
    this.listeners = {}
  }

  setup (loginToken) {
    let self = this
    if (this.socket) this.socket.disconnect()
    if (loginToken === 'empty') return
    this.socket = io(ApiConfig.baseURL, {query: `auth_token=${loginToken}`})
    this.socket.on('server_setting', data => {
      self.serverTime = data.time
      self.serverRealApi = data.type
      self.onlineClients = data.clients
      let cbfuncs = self.listeners['server_setting']
      if (cbfuncs) {
        cbfuncs.forEach(cbfunc => {
          return cbfunc(data)
        })
      }
    })
    this.socket.on('connect', () => {
      self.isConnected = true
      let cbfuncs = self.listeners['connect']
      if (cbfuncs) {
        cbfuncs.forEach(cbfunc => {
          return cbfunc()
        })
      }
    })
    this.socket.on('disconnect', () => {
      self.isConnected = false
      let cbfuncs = self.listeners['disconnect']
      if (cbfuncs) {
        cbfuncs.forEach(cbfunc => {
          return cbfunc()
        })
      }
    })
    this.handlers.forEach(handle => {
      this.socket.on(handle.event, data => {
        handle.callback(data)
      })
    })
  }
  addListener (event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback)
    } else {
      this.listeners[event] = [callback]
    }
  }
  removeListener (event, callback) {
    if (this.listeners[event]) {
      let index = this.listeners[event].indexOf(callback)
      this.listeners[event].splice(index, 1)
    }
  }
  on (event, callback) {
    this.handlers.push({event, callback})
    if (this.socket) {
      this.socket.on(event, data => { callback(data) })
    }
  }
  remove(event, func){
    if (this.socket) {
      this.socket.removeListener(event, func)
    }
  }
  emit (event, data) {
    if (this.socket) {
      this.socket.emit(event, data)
      return true
    }
    return false
  }
  socket () {
    return this.socket
  }
}

let api = new SocketApi()
export const SocketApiClass = SocketApi
export default api
