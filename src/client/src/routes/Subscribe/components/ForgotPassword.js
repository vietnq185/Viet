/* eslint-disable */

import React from 'react'

import config from '../../../config'

import API from '../../../helpers/api'
import Utils from '../../../helpers/utils'
import validate from '../../../helpers/validate'

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props)
    this.initialErrors = {
      email: ''
    }
    this.errors = Utils.copy(this.initialErrors)
    this.state = {
      hasError: false,
      errMsg: ''
    }
  }

  resetErrors() {
    this.errors = Utils.copy(this.initialErrors)
    this.setState({ hasError: false })
  }

  setErrors(errors) {
    this.errors = errors
    this.setState({ hasError: true })
  }

  submitForm() {
    const self = this

    this.resetErrors()

    const rules = {
      email: {
        required: 'Email is required',
        email: 'Please enter correct email format'
      }
    }

    const result = validate(rules, this.refs)  // result === null -> valid, result === error object -> invalid

    if (result === null) {
      // can submit
      return API.forgotPassword({ email: self.refs.email.value }).then((result) => {
        console.info('the response: ', result);
        switch (result.msg) {
          case 'EMAIL_SENT':
            this.setState({ errMsg: 'An email has been sent to your email. Futhur information please check your email.' })
            break
          case 'EMAIL_NOT_SENT':
            this.setState({ errMsg: 'Failed to send email. Please try again' })
            break
          case 'EMAIL_NOT_EXISTS':
            this.setState({ errMsg: 'Email does not exists in our system' })
            break
          default:
            this.setState({ errMsg })
        }
      }).catch((errMsg) => {

      })
      //
    } else {
      this.setErrors(result)
    }
  }

  componentDidMount() {
  }

  render() {
    const requiredLabel = (<abbr className='dk-red-text'>&nbsp;*</abbr>)
    return (
      <div className='form-subscribe'>
        <div className='form-title'>Forgot Password</div>
        <div className='form-title-desc text-center'>Already got an account but can’t log in? Enter your email address below and we’ll send you password reset instruction.</div>
        <br />
        <form className='form form-subscribe-login'>
          <div className={['form-group', this.errors.email ? 'has-error' : ''].join(' ')}>
            <label htmlFor='contact-name'>Email address{requiredLabel}</label>
            <input className='form-control' name='email' id='email' required='' type='text' ref='email' />
            <span className={[this.errors.email ? 'help-block' : 'hide'].join(' ')}>{this.errors.email}</span>
          </div>
          <div className={['form-group', this.state.errMsg ? 'has-error' : 'hide'].join(' ')}>
            <span className='help-block'>{this.state.errMsg}</span>
          </div>
          <div className='form-group'>
            <button type='button' className='btn btn-block dk-bg-blue dk-white' onClick={() => this.submitForm()}>Send</button>
          </div>
          <div className='form-group text-center'>
            <a href='javascript: void(0);' onClick={() => this.props.changeStep(this.props.steps.signIn)}>Sign In</a>
          </div>
        </form>
      </div>
    )
  }
}

ForgotPassword.propTypes = {
  steps: React.PropTypes.object.isRequired,
  changeStep: React.PropTypes.func.isRequired,
  auth: React.PropTypes.object.isRequired
}

export default ForgotPassword
