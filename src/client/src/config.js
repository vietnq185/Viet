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
  changeSubscriptionStatus: '/api/subscriptions/changeStatus/:subscriptionId/:newStatus', // GET
  getSubscriptionDetails: '/api/subscriptions/details/:subscriptionId', // GET
  signIn: '/api/auth/login', // POST
  checkToken: '/api/auth/checkToken', // GET
  signUp: '/api/users',  // POST
  checkLogin: '/api/users/:userId', // GET
  plans: '/api/plans', // GET
  cclist: '/api/users/cclist/:userId', // GET
  createSubscription: '/api/subscriptions', // POST
  countSubscriptions: '/api/subscriptions/countSubscriptions/:userId', // GET
  assignStudent: '/api/subscriptions/AssignStudent', // POST
  getSubscriptionList: '/api/subscriptions/list/:userId/:page', // GET
  linkStudent: '/api/users/linkStudent', // POST
  upgradeSubscription: '/api/subscriptions/upgrade',  // POST
  checkToShowBannerDiscount: '/api/subscriptions/checkToShowBannerDiscount', // GET
  cancelSubscription: '/api/subscriptions/cancelSubscription', // GET
  getOptions: '/api/subscriptions/getOptions', // GET
  forgotPassword: '/api/subscriptions/forgotPassword', // GET
  getUserForgotPassword: '/api/subscriptions/getUserForgotPassword/:id/:hash', // GET
  resetPassword: '/api/subscriptions/resetPassword', // POST
  getOptionPairs: '/api/auth/getOptionPairs', // GET
  updateProfile: '/api/users/:userId',  // POST
  getAssignedStudents: '/api/subscriptions/getAssignedStudents'  // GET
}
config.api = concatHost(config.apiServer, config.api)

// storage
config.storageName = 'ASLS_06fbc309b58c08137d93852dfe86a34f76e0f281a5b8e57e0692463996e6795c'
config.tokenKey = 'ASLS_TOKEN_06fbc309b58c08137d93852dfe86a34f76e0f281a5b8e57e0692463996e6795c'

export default config
