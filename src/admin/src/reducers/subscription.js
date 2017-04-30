/* eslint-disable */

import API from '../helpers/api'
import Utils from '../helpers/utils'
import * as authActions from './auth'
// ------------------------------------
// Constants
// ------------------------------------
const initialList = {
  subscriptions: [],
  page: 1,
  totalPages: 0
}
// ------------------------------------
// Actions
// ------------------------------------
const GET_SUBSCRIPTION_LIST = 'GET_SUBSCRIPTION_LIST'

const updateList = (result) => {
  return {
    type: GET_SUBSCRIPTION_LIST,
    result
  }
}

export const getSubscriptionList = (page) => (dispatch, getState) => {
  return authActions.checkAccessToken().then((jwt) => {
    return API.getSubscriptionList(jwt.accessToken || '', jwt.userId || '', page).then((result) => {
      dispatch(updateList(result))
    }).catch(() => {
      dispatch(updateList({
        ...initialList
      }))
    })
  }).catch((error) => {
    dispatch(authActions.logout())
  })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  list: {
    ...initialList
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_SUBSCRIPTION_LIST:
      console.info('action.result: ', action.result)
      return Utils.merge(state, { list: { ...state.list, ...action.result } })
      break // eslint-disable-line
    default:
      return state
  }
}
