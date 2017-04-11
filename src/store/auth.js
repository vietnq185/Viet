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
export const loginSuccess = (data, nextAction = () => { }) => (dispatch, getState) => {
  console.info('login data: ', data)
  return new Promise((resolve, reject) => {
    TokenStorage.set(data.jwt)
    return resolve(data)
  }).then((result) => {
    const jwt = Utils.copy(result.jwt)
    const user = Utils.copy(result)
    delete user.jwt
    dispatch(updateLoginResult({ isLoggedIn: true, jwt, user }))
    nextAction()  // call next action, in this function can be redirect or dispatch another action
  }).catch(() => {
    dispatch(updateLoginResult({ isLoggedIn: false, jwt: {}, user: {} }))
  })
}

export const logout = () => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    TokenStorage.delete()
    return resolve()
  }).then(() => {
    dispatch(updateLoginResult({ isLoggedIn: false, jwt: {}, user: {} }))
  }).catch(() => {
    dispatch(updateLoginResult({ isLoggedIn: false, jwt: {}, user: {} }))
  })
}

// in case user has already login, then press F5,
// now wee need to check if accessToken is still valid, then we need to get login info
export const checkTokensAtStartUp = () => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    const jwt = TokenStorage.get()
    const { accessToken, userId } = jwt
    if (!accessToken || !userId) {
      return resolve() // not login before
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
// Reducer
// ------------------------------------
const initialState = {
  isLoggedIn: false,
  jwt: {},
  user: {}
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
