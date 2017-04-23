/* eslint-disable */

import React from 'react'

import API from '../../../helpers/api'
import Utils from '../../../helpers/utils'
import validate from '../../../helpers/validate'

class Step1SignIn extends React.Component {
  constructor (props) {
    super(props)
    this.initialErrors = {
      email: '',
      password: ''
    }
    this.errors = Utils.copy(this.initialErrors)
    this.state = {
      hasError: false,
      errMsg: ''
    }
  }

  resetErrors () {
    this.errors = Utils.copy(this.initialErrors)
    this.setState({ hasError: false })
  }

  setErrors (errors) {
    this.errors = errors
    this.setState({ hasError: true })
  }

  submitForm () {
    const self = this

    this.resetErrors()

    const rules = {
      email: {
        required: 'Email is required',
        email: 'Invalid email address'
      },
      password: {
        required: 'Password is required'
      }
    }

    const result = validate(rules, this.refs)  // result === null -> valid, result === error object -> invalid

    if (result === null) {
      // can submit
      API.login({ username: self.refs.email.value, password: self.refs.password.value }).then((result) => {
        const nextAction = () => self.props.changeStep(self.props.steps.plan)
        self.props.loginSuccess(result, nextAction)
      }).catch((errMsg) => {
        switch (errMsg) {
          case 'UNREGISTERED_USER':
            this.setState({ errMsg: 'Email not found.' })
            break
          case 'WRONG_PASSWORD':
            this.setState({ errMsg: 'Incorrect password.' })
            break
          default:
            this.setState({ errMsg })
        }
      })
      //
    } else {
      this.setErrors(result)
    }
  }

  componentDidMount () {
    const { changeStep, steps, auth: { isLoggedIn } } = this.props
    if (isLoggedIn) {
      changeStep(steps.plan)
    }
  }

  render () {
    const requiredLabel = (<abbr className='dk-red-text'>&nbsp;*</abbr>)
    return (
      <div className='form-subscribe'>
        <div className='form-title'>Sign In</div>
        <div className='form-title-desc text-center'>If you have a parent account with us, please sign in.</div>
        <br />
        <form className='form form-subscribe-login'>
          <div className={['form-group', this.errors.email ? 'has-error' : ''].join(' ')}>
            <label htmlFor='contact-name'>Email address{requiredLabel}</label>
            <input className='form-control' name='email' id='email' required='' type='text' ref='email' />
            <span className={[this.errors.email ? 'help-block' : 'hide'].join(' ')}>{this.errors.email}</span>
          </div>
          <div className={['form-group', this.errors.password ? 'has-error' : ''].join(' ')}>
            <label htmlFor='contact-name'>Password{requiredLabel}</label>
            <input className='form-control' name='password' id='password' required='' type='password' ref='password' />
            <span className='forgot-password'><a href='javascript: void(0);'>Forgot password?</a></span>
            <span className={[this.errors.password ? 'help-block' : 'hide'].join(' ')}>{this.errors.password}</span>
          </div>
          <div className={['form-group', this.state.errMsg ? 'has-error' : 'hide'].join(' ')}>
            <span className='help-block'>{this.state.errMsg}</span>
          </div>
          <div className='form-group'>
            <button type='button' className='btn btn-block dk-bg-blue dk-white' onClick={() => this.submitForm()}>Sign In</button>
          </div>
          <div className='form-group text-center'>
            Do not have a parent account?&nbsp;
            <a href='javascript: void(0);' onClick={() => this.props.changeStep(this.props.steps.signUp)}>Sign Up Now</a>
          </div>
        </form>
      </div>
    )
  }
}

Step1SignIn.propTypes = {
  steps: React.PropTypes.object.isRequired,
  changeStep: React.PropTypes.func.isRequired,
  auth: React.PropTypes.object.isRequired
}

export default Step1SignIn
