/* eslint-disable */

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
config.apiServer = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_DEV_API_URL : process.env.REACT_APP_API_URL;
config.api = {
  getUserList: '/api/users/list',  // POST
  changeSubscriptionStatus: '/api/subscriptions/changeStatus/:subscriptionId/:newStatus', // GET
  getSubscriptionDetails: '/api/subscriptions/details/:subscriptionId', // GET
  signIn: '/api/auth/login', // POST
  checkToken: '/api/auth/checkToken', // GET
  signUp: '/api/users',  // POST
  checkLogin: '/api/users/:userId', // GET
  plans: '/api/plans', // GET
  cclist: '/api/users/cclist/:userId', // GET
  createSubscription: '/api/subscriptions', // POST
  countSubscriptions: '/api/subscriptions/countSubscriptions', // GET
  assignStudent: '/api/subscriptions/AssignStudent', // POST
  getSubscriptionList: '/api/subscriptions/list-all', // POST
  linkStudent: '/api/users/linkStudent', // POST
  upgradeSubscription: '/api/subscriptions/upgrade',  // POST
  getOptionList: '/api/options',  // GET
  updateOption: '/api/options', // POST
  deleteUser: '/api/users/:userId'  // DELETE
}
config.api = concatHost(config.apiServer, config.api)

// storage
config.storageName = 'ASLS_ADMIN_506655ab2af8153589f4d1cbad9e924a70bbf0aa31314a092263422c22f270f2'
config.tokenKey = 'ASLS_TOKEN_ADMIN_506655ab2af8153589f4d1cbad9e924a70bbf0aa31314a092263422c22f270f2'

export default config
