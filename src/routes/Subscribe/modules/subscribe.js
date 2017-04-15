import constants from '../../../constants'
import API from '../../../helpers/api'
import Utils from '../../../helpers/utils'
import * as auth from '../../../store/auth'
// ------------------------------------
// Constants
// ------------------------------------
export const STEPS = {
  signIn: 'SIGN_IN',
  signUp: 'SIGN_UP',
  plan: 'PLAN',
  payment: 'PAYMENT',
  createStudent: 'CREATE_STUDENT',
  linkStudent: 'LINK_STUDENT'
}

// ------------------------------------
// Actions
// ------------------------------------
export const CHANGE_STEP = 'CHANGE_STEP'

export const stepResult = (step) => {
  return {
    type: CHANGE_STEP,
    step
  }
}

export const changeStep = (step) => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    if (step === STEPS.plan) {
      dispatch(getPlans())
    }
    if (step === STEPS.plan) {
      dispatch(getCCList())
    }
    dispatch(stepResult(step))
    resolve()
  })
}

// ------------------------------------

const GET_PLANS = 'GET_PLANS'

const plansResult = (plans) => {
  return {
    type: GET_PLANS,
    plans
  }
}

export const getPlans = () => (dispatch, getState) => {
  return API.getPlans().then((plans) => {
    dispatch(plansResult(plans))
  }).catch(() => {
    dispatch(plansResult([]))
  })
}

const SELECT_PLAN = 'SELECT_PLAN'

export const selectPlan = (selectedPlan) => {
  return {
    type: SELECT_PLAN,
    selectedPlan
  }
}

// ------------------------------------

const GET_CCLIST = 'GET_CCLIST'

const ccResult = (cclist) => {
  return {
    type: GET_CCLIST,
    cclist
  }
}

export const getCCList = () => (dispatch, getState) => {
  const { auth } = getState()
  return API.getCCList(auth.jwt.accessToken || '', auth.jwt.userId || '').then((cclist) => {
    dispatch(ccResult(cclist))
  }).catch(() => {
    dispatch(ccResult([]))
  })
}

const SAVE_PAYMENT = 'SAVE_PAYMENT'

const paymentResult = (result) => {
  return {
    type: SAVE_PAYMENT,
    result
  }
}

const COMPLETE_SUBSCRIPTION = 'COMPLETE_SUBSCRIPTION'

const subscriptionResult = (result) => {
  return {
    type: COMPLETE_SUBSCRIPTION,
    result
  }
}

const RESTART_SUBSCRIPTION = 'RESTART_SUBSCRIPTION'

const restart = () => {
  return {
    type: RESTART_SUBSCRIPTION
  }
}

export const completeSubscription = (data) => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    dispatch(paymentResult(data))
    return auth.checkAccessToken().then(() => {
      const state = getState()
      const jwt = state.auth.jwt
      const info = state.subscribe
      console.info('createSubscription => state: ', state)
      console.info('createSubscription => info: ', info)
      const subData = {
        parentId: jwt.userId,
        planId: info.selectedPlan._id,
        expirationType: info.selectedPlan.frequency,
        type: 'USER_PLAN',
        channel: info.paymentMethod
      }
      if (info.paymentMethod !== constants.paymentMethod.bankTransfer) {
        subData.cardId = info.selectedCardId
        if (info.selectedCardId.length === 0) {
          // add new card
          subData.addCard = 1
          subData.card_name = info.newCC.name
          subData.ccnum = info.newCC.ccnum
          subData.ccmonth = info.newCC.ccmonth
          subData.ccyear = info.newCC.ccyear
          subData.cvv = info.newCC.cvv
        }
      }
      console.info('createSubscription => subData: ', subData)
      return API.createSubscription(jwt.accessToken, subData).then((result) => {
        console.info('createSubscription => result: ', result)
        dispatch(restart())
        dispatch(subscriptionResult({ success: true, result, error: null }))
        dispatch(changeStep(STEPS.linkStudent))
      }).catch((error) => {
        dispatch(subscriptionResult({ success: false, result: null, error }))
        console.info('createSubscription => error: ', error)
      })
    }).catch((error) => {
      console.info('createSubscription => checkAccessToken => error: ', error)
      const nextAction = () => {
        dispatch(changeStep(STEPS.signIn))
      }
      dispatch(auth.logout(nextAction))
    })
  })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  prevStep: STEPS.signIn,
  step: STEPS.signIn,
  steps: STEPS,
  plans: [],
  selectedPlan: {},
  // discount is applied for the first 200 subscription,
  // so that we should have an async action to check can apply discount or not,
  // and assign to applyDiscount property
  applyDiscount: true,
  discountPercent: 20,
  cclist: [],
  selectedCardId: '',
  paymentMethod: constants.paymentMethod.creditCard,
  newCC: {
    name: '',
    ccnum: '',
    ccmonth: '',
    ccyear: '',
    cvv: ''
  },
  subscriptionResult: {
    success: false,
    result: null,
    error: null
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_STEP:
      const prevStep = state.step
      return Utils.merge(state, { step: action.step, prevStep })
      break // eslint-disable-line
    case GET_PLANS:
      return Utils.merge(state, { plans: action.plans })
      break // eslint-disable-line
    case SELECT_PLAN:
      return Utils.merge(state, { selectedPlan: action.selectedPlan })
      break // eslint-disable-line
    case GET_CCLIST:
      return Utils.merge(state, { cclist: action.cclist })
      break // eslint-disable-line
    case SAVE_PAYMENT:
      return Utils.merge(state, {
        paymentMethod: action.result.paymentMethod,
        selectedCardId: action.result.selectedCardId,
        newCC: action.result.newCC
      })
      break // eslint-disable-line
    case COMPLETE_SUBSCRIPTION:
      return Utils.merge(state, { subscriptionResult: action.result })
      break // eslint-disable-line
    case RESTART_SUBSCRIPTION:
      return Utils.copy(initialState)
      break // eslint-disable-line
    default:
      return state
  }
}
