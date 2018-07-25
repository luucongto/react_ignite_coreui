import runtimeEnv from '@mars/heroku-js-runtime-env';
const env = runtimeEnv()
const ApiConfig = {
  baseURL: env.REACT_APP_API_URL || 'http://localhost:3000/'
}

export default ApiConfig
