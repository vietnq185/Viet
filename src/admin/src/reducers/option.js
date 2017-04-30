/* eslint-disable */

import API from '../helpers/api'
import Utils from '../helpers/utils'
import * as authActions from './auth'
// ------------------------------------
// Constants
// ------------------------------------

// ------------------------------------
// Actions
// ------------------------------------
const GET_OPTION_LIST = 'GET_OPTION_LIST'

const updateList = (result) => {
  return {
    type: GET_OPTION_LIST,
    result
  }
}

export const getOptionList = () => (dispatch, getState) => {
  return authActions.checkAccessToken().then((jwt) => {
    return API.getOptionList(jwt.accessToken || '').then((result) => {
      dispatch(updateList(result))
    }).catch(() => {
      dispatch(updateList([]))
    })
  }).catch((error) => {
    dispatch(authActions.logout())
  })
}

const UPDATE_OPTION_RESULT = 'UPDATE_OPTION_RESULT';

const updateOptionsResult = (updateResult) => {
  return {
    type: UPDATE_OPTION_RESULT,
    updateResult
  }
}

export const updateOptions = (data) => (dispatch, getState) => {
  return authActions.checkAccessToken().then((jwt) => {
    return API.updateOptions(jwt.accessToken || '', data).then((result) => {
      dispatch(getOptionList())
      dispatch(updateOptionsResult({ success: true, errMsg: 'Options updated' }))
    }).catch((errMsg) => {
      dispatch(getOptionList())
      dispatch(updateOptionsResult({ success: false, errMsg }))
    })
  }).catch((error) => {
    dispatch(authActions.logout())
  })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  list: [],
  updateResult: {
    success: false,
    errMsg: ''
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_OPTION_LIST:
      return Utils.merge(state, { list: action.result })
      break // eslint-disable-line
    case UPDATE_OPTION_RESULT:
      console.info('action.result => UPDATE_OPTION_RESULT: ', action.updateResult)
      return Utils.merge(state, { updateResult: action.updateResult })
      break // eslint-disable-line
    default:
      return state
  }
}
