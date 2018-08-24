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
    // const naviMonitor = (response) => console.log('hey!  listen! ', response)
    // this.api.addMonitor(naviMonitor)
    this.authenticated = this.authenticated.bind(this)
    this.login = this.login.bind(this)
    this.loginGoogle = this.loginGoogle.bind(this)
    this.logout = this.logout.bind(this)
    this.accountInfo = this.accountInfo.bind(this)
    this.serverSetting = this.serverSetting.bind(this)
    this.notice = this.notice.bind(this)
    this.product = this.product.bind(this)
    this.soldProduct = this.soldProduct.bind(this)
    this.seller = this.seller.bind(this)
  }

  authenticated (loginToken) {
    this.loginToken = loginToken
    this.api.setHeader('Authorization', 'jwt ' + loginToken)
    SocketApi.setup(loginToken)
  }

  login (params) {
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

  accountInfo (params) {
    if (params && params.command === 'update') {
      return this.api.post('account/setting', params).then(result => {
        return result ? result.data : null
      })
    }
    return this.api.get('account/all').then(result => {
      return result ? result.data : null
    }).catch(error => {
      return {error: 'unauthorized'}
    })
  }

  serverSetting (params) {
    if (params.command === 'get') {
      return this.api.get('admin/apisetting').then(result => {
        return result ? result.data : null
      })
    }
    if(params.command === 'announce'){
      return this.api.post('admin/announce', params).then(result => {
        return result ? result.data : null
      })
    }
    if (params.command === 'post') {
      return this.api.post('admin/apisetting', params).then(result => {
        return result ? result.data : null
      })
    }
  }
  notice (params) {
    if (params.command === 'post') {
      return this.api.post('notice/add', params).then(result => {
        return result ? result.data : null
      })
    }
    if (params.command === 'getAdmin') {
      return this.api.get('notice/admin').then(result => {
        return result ? result.data : null
      })
    }
    return this.api.get('notice/all').then(result => {
      return result ? result.data : null
    })
  }
  product (params) {
    if (params.command === 'post') {
      return this.api.post('notice/add', params).then(result => {
        return result ? result.data : null
      })
    }
    return this.api.get('product/sold', params).then(result => {
      return result ? result.data : null
    })
  }
  soldProduct (params) {
    if (params.command === 'getAdmin') {
      return this.api.get('product/seller', params).then(result => {
        return result ? result.data : null
      })
    }
  }
  seller (params) {
    if (params.command === 'import') {
      console.log(params)
      let data = new FormData()
      data.append('file', params.file)
      data.append('name', 'test')
      return this.api.post('product/import', data).then(result => {
        return result ? result.data : null
      })
    }
  }
}

let api = new API()

export default api
