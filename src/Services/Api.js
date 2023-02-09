import apisauce from 'apisauce'
import ApiConfig from '../Config/ApiConfig'
import autoBind from 'auto-bind'

class API {
  constructor(loginToken, baseURL = ApiConfig.baseURL) {
    this.api = apisauce.create({
      // base URL is read from the "constructor"
      baseURL,
      // here are some default headers
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      // 15 second timeout...
      timeout: 15000,
    })
    // const naviMonitor = (response) => console.log('hey!  listen! ', response)
    // this.api.addMonitor(naviMonitor)
    // this.authenticated = this.authenticated.bind(this)
    // this.login = this.login.bind(this)
    // this.loginGoogle = this.loginGoogle.bind(this)
    // this.logout = this.logout.bind(this)
    autoBind(this)
  }

  authenticated(loginToken) {
    console.log('authenticated', loginToken)
    this.loginToken = loginToken
    this.api.setHeader('Authorization', 'Bearer ' + loginToken)
  }

  login(params) {
    console.log('login', params)
    if (params.type === 'local') {
      return this.api.post('login', params).then((data) => {
        let result = data.data
        console.log('result', result)
        if (result.data) this.authenticated(result.data.token)
        return result
      })
    }
    // return this.loginGoogle(params.tokenBlob)
  }
  loginGoogle(data) {
    return this.api.post('auth/google', data).then((data) => {
      let result = data.data
      if (result.success && result.token) this.authenticated(result.token)
      return result
    })
  }

  logout() {
    return this.api.get('logout').then((result) => {
      this.authenticated('empty')
      return result
    })
  }

  forgotPassword(params) {
    return this.api.post('auth/forgotPassword', params).then((data) => {
      let result = data ? data.data : null
      return result
    })
  }

  register(params) {
    console.log('register', this.api)
    return this.api.post('register', params).then((data) => {
      let result = data.data
      return result
    })
  }

  createOrder(params) {
    return this.api.post('orders', params).then((data) => {
      let result = data ? data.data : null
      return result
    })
  }

  listOrder(params) {
    return this.api.get('orders', params).then((data) => {
      let result = data ? data.data : null
      return result
    })
  }

  getOrder(params) {
    return this.api.get('orders/' + params).then((data) => {
      let result = data ? data.data : null
      return result
    })
  }
  updateOrder(params) {
    return this.api.post('orders/' + params.orderTransportNumber, params).then((data) => {
      let result = data ? data.data : null
      return result
    })
  }
}

let api = new API()

export default api
