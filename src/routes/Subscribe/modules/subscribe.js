import Utils from '../../../helpers/utils'
// ------------------------------------
// Constants
// ------------------------------------
export const CHANGE_STEP = 'CHANGE_STEP'

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
export function changeStep (step) {
  return {
    type: CHANGE_STEP,
    step
  }
}

export const actions = {
  changeStep
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  step: STEPS.signIn,
  steps: STEPS
}
export default function subscribeReducer (state = initialState, action) {
  switch (action.type) {
    case CHANGE_STEP:
      const newState = Utils.copy(state)
      newState.step = action.step
      return newState
      break // eslint-disable-line
    default:
      return state
  }
}
