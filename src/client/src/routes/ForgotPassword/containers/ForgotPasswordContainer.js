import { connect } from 'react-redux'

import * as authActions from '../../../store/auth'
import * as subscribeActions from '../../Subscribe/modules/subscribe'

/*  This is a container component. Notice it does not contain any JSX,
  nor does it import React. This component is **only** responsible for
  wiring in the actions and state necessary to render a presentational
  component - in this case, the ForgotPassword:   */

import ForgotPassword from '../components/ForgotPassword'

/*  Object of action creators (can also be function that returns object).
  Keys will be passed as props to presentational components. Here we are
  implementing our wrapper around increment; the component doesn't care   */

const mapDispatchToProps = {
  ...authActions,
  ...subscribeActions
}

const mapStateToProps = (state) => ({
  ...state.ForgotPassword,
  auth: state.auth,
  subscribe: state.subscribe
})

/*  Note: mapStateToProps is where you should use `reselect` to create selectors, ie:

  import { createSelector } from 'reselect'
  const ForgotPassword = (state) => state.ForgotPassword
  const tripleCount = createSelector(ForgotPassword, (count) => count * 3)
  const mapStateToProps = (state) => ({
    ForgotPassword: tripleCount(state)
  })

  Selectors can compute derived data, allowing Redux to store the minimal possible state.
  Selectors are efficient. A selector is not recomputed unless one of its arguments change.
  Selectors are composable. They can be used as input to other selectors.
  https://github.com/reactjs/reselect    */

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword)
