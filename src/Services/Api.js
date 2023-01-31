import apisauce from 'apisauce'
import ApiConfig from '../Config/ApiConfig'
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
    // const naviMonitor = (response) => console.log('hey!  listen! ', response)
    // this.api.addMonitor(naviMonitor)
    this.authenticated = this.authenticated.bind(this)
    this.login = this.login.bind(this)
    this.loginGoogle = this.loginGoogle.bind(this)
    this.logout = this.logout.bind(this)
  }

  authenticated (loginToken) {
    this.loginToken = loginToken
    this.api.setHeader('Authorization', loginToken)
  }

  login (params) {
    if (params.type === 'local') {
      return this.api.post('login', params).then(data => {
        let result = data.data
        result.success = result.data || result.status === 'success'
        if (result.success) this.authenticated(result.access_token)
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
}

let api = new API()

export default api
