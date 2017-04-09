// ---------------------------------------------------------------------------------------------
// production mode
// console.log = console.info = console.warn = console.error = function () { }
// ---------------------------------------------------------------------------------------------
const concatHost = (host, obj, enabled) => {
  if (typeof enabled === 'boolean' && enabled === false) {
    return {}
  }
  var retObj = {}
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      retObj[key] = host + obj[key]
    }
  }
  return retObj
}
const merge = (src, dst) => { // eslint-disable-line
  for (var key in dst) {
    if (dst.hasOwnProperty(key)) {
      src[key] = dst[key]
    }
  }
  return src
}
// ---------------------------------------------------------------------------------------------

const config = {}

// API
config.apiServer = 'http://localhost:4040'
config.api = {
  signUp: '/api/users',  // POST
  signIn: '/api/auth/login' // POST
}
config.api = concatHost(config.apiServer, config.api)

// storage
config.storageName = 'ASLS'
config.tokenKey = 'ASLS_TOKEN'

export default config
