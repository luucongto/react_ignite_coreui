import apisauce from 'apisauce'
import ApiConfig from '../Config/ApiConfig'
import SocketApi from './SocketApi'
class API {
  constructor (loginToken, baseURL = ApiConfig.baseURL) {
    this.api = apisauce.create({
      // base URL is read from the "constructor"
      baseURL,
      // here are some default headers
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      // 15 second timeout...
      timeout: 15000
    })
    const naviMonitor = (response) => console.log('hey!  listen! ', response)
    this.api.addMonitor(naviMonitor)
    this.loginToken = loginToken
    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
    this.accountInfo = this.accountInfo.bind(this)
  }

  authenticated (loginToken) {
    this.loginToken = loginToken
    this.api.setHeader('Authorization', 'jwt ' + loginToken)
    SocketApi.setup(loginToken)
  }

  login (params) {
    console.log(params)
    if (params.type === 'local') {
      return this.api.post('login', params).then(data => {
        let result = data.data
        if (result.success && result.token) this.authenticated(result.token)
        return result
      })
    }
    return this.loginGoogle(params.tokenBlob)
  }
  loginGoogle (data) {
    return this.api.post('auth/google', data).then(data => {
      let result = data.data
      if (result.success && result.token) this.authenticated(result.token)
      return result
    })
  }

  logout () {
    return this.api.get('logout').then(result => {
      this.authenticated('empty')
      return result
    })
  }

  accountInfo () {
    return this.api.get('account/all').then(result => {
      return result ? result.data : null
    })
  }

  serverSetting (params) {
    if (params.command === 'get') {
      return this.api.get('admin/apisetting').then(result => {
        return result ? result.data : null
      })
    }
    if (params.command === 'post') {
      return this.api.post('admin/apisetting', params).then(result => {
        return result ? result.data : null
      })
    }
  }
}

let api = new API()

export default api
