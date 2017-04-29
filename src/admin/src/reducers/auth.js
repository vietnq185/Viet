import API from '../helpers/api'
import Utils from '../helpers/utils'
import TokenStorage from '../helpers/tokenStorage'
// ------------------------------------
// Constants
// ------------------------------------
const UPDATE_LOGIN_RESULT = 'UPDATE_LOGIN_RESULT'

// ------------------------------------
// Actions
// ------------------------------------
const updateLoginResult = (result) => {
  return {
    type: UPDATE_LOGIN_RESULT,
    result
  }
}

// ------------------------------------
// Specialized Action Creator
// ------------------------------------
export const authenticate = (email, password, nextAction = () => { }) => (dispatch, getState) => {
  API.login({ username: email, password }).then((result) => {
    dispatch(loginSuccess(result));// eslint-disable-line
    nextAction();  // call next action (if any)
  }).catch((errMsg) => {
    dispatch(updateLoginResult({ isLoggedIn: false, jwt: {}, user: {}, errMsg }))
    nextAction();  // call next action (if any)
  });
}

export const loginSuccess = (data, nextAction = () => { }) => (dispatch, getState) => {
  console.info('login data: ', data)
  return new Promise((resolve, reject) => {
    TokenStorage.set(data.jwt)
    return resolve(data)
  }).then((result) => {
    const jwt = Utils.copy(result.jwt)
    const user = Utils.copy(result)
    delete user.jwt
    dispatch(updateLoginResult({ isLoggedIn: true, jwt, user, errMsg: '' }))
    nextAction()  // call next action, in this function can be redirect or dispatch another action
  }).catch(() => {
    dispatch(updateLoginResult({ isLoggedIn: false, jwt: {}, user: {}, errMsg: 'Cannot save data' }))
  })
}

export const logout = (nextAction = () => { }) => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    TokenStorage.delete()
    return resolve()
  }).then(() => {
    dispatch(updateLoginResult({ isLoggedIn: false, jwt: {}, user: {} }))
    nextAction()  // call next action (if any)
  }).catch(() => {
    dispatch(updateLoginResult({ isLoggedIn: false, jwt: {}, user: {} }))
    nextAction()  // call next action (if any)
  })
}

// in case user has already login, then press F5,
// now wee need to check if accessToken is still valid, then we need to get login info
export const checkTokensAtStartUp = () => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    const jwt = TokenStorage.get()
    const { accessToken, userId } = jwt
    if (!accessToken || !userId) {
      return resolve('NOT_LOGIN') // not login before
    }
    return API.checkLogin(accessToken, userId).then((result) => resolve(Utils.copy({ jwt, user: result }))).catch(reject) // eslint-disable-line
  }).then((result) => {
    if (Utils.isNotEmptyObject(result)) {
      console.info('result of check login: ', result)
      return dispatch(updateLoginResult({ isLoggedIn: true, jwt: result.jwt }))
    }
  }).catch(() => dispatch(logout()))
}

// ------------------------------------
// Utility function
// ------------------------------------
export const checkAccessToken = () => {
  return new Promise((resolve, reject) => {
    const jwt = TokenStorage.get()
    const { accessToken, userId } = jwt
    if (!accessToken || !userId) {
      return reject('NOT_LOGIN') // not login before
    }
    return API.checkToken(accessToken).then(() => {
      return resolve(jwt)
    }).catch(reject) // eslint-disable-line
  })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  isLoggedIn: false,
  jwt: {},
  user: {},
  errMsg: ''
}

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_LOGIN_RESULT:
      return Utils.merge(state, action.result)
      break // eslint-disable-line
    default:
      return state
  }
}
