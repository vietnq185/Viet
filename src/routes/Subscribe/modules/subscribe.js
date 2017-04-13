import constants from '../../../constants'
import API from '../../../helpers/api'
import Utils from '../../../helpers/utils'
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

const COMPLETE_SUBSCRIPTION = 'COMPLETE_SUBSCRIPTION'

const subscriptionResult = (result) => {
  return {
    type: COMPLETE_SUBSCRIPTION,
    result
  }
}

const SAVE_PAYMENT = 'SAVE_PAYMENT'

const paymentResult = (result) => {
  return {
    type: SAVE_PAYMENT,
    result
  }
}

export const completeSubscription = (data) => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    dispatch(paymentResult(data))
    resolve()
  })
  /* const { auth } = getState()
  return API.getCCList(auth.jwt.accessToken || '', auth.jwt.userId || '').then((cclist) => {
    // dispatch(subscriptionResult(cclist))
  }).catch(() => {
    // dispatch(subscriptionResult([]))
  }) */
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
    default:
      return state
  }
}
