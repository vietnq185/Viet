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

export const getSubscriptionList = (data) => (dispatch, getState) => {
  return authActions.checkAccessToken().then((jwt) => {
    return API.getSubscriptionList(jwt.accessToken || '', data).then((result) => {
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

const PLAN_LIST = 'PLAN_LIST'

const updatePlanList = (result) => {
  return {
    type: PLAN_LIST,
    result
  }
}

export const getPlanList = () => (dispatch, getState) => {
  return API.getPlans().then((result) => {
    dispatch(updatePlanList(result))
  }).catch(() => {
    dispatch(updatePlanList([]))
  })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  list: {
    ...initialList
  },
  planList: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_SUBSCRIPTION_LIST:
      return Utils.merge(state, { list: { ...state.list, ...action.result } })
      break // eslint-disable-line
    case PLAN_LIST:
      return Utils.merge(state, { planList: action.result })
      break // eslint-disable-line
    default:
      return state
  }
}
