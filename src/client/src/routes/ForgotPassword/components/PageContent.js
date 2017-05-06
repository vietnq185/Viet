/* eslint-disable */
import React from 'react'
import Utils from '../../../helpers/utils'
import API from '../../../helpers/api'
import validate from '../../../helpers/validate'

class PageContent extends React.Component {
  constructor(props) {
    super(props)
    this.initialErrors = {
      password: '',
      confirmPassword: ''
    }
    this.errors = Utils.copy(this.initialErrors)
    this.state = {
      id: this.props.params.id || '',
      hash: this.props.params.hash || '',
      isValid: false,
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

  componentDidMount() {
    var self = this

    API.getUserForgotPassword(this.state.id, this.state.hash).then((resp) => this.setState({ isValid: resp.status === 'OK' ? true : false })).catch((error) => {
      self.setState({ isValid: resp.status === 'OK' ? true : false })
    })
  }

  submitForm() {
    const self = this

    this.resetErrors()

    const rules = {
      password: {
        required: 'Password is required'
      },
      confirmPassword: {
        required: 'Confirm password is required',
        match: {
          ref: 'password',
          msg: 'Confirm password does not match'
        }
      }
    }

    const result = validate(rules, this.refs)  // result === null -> valid, result === error object -> invalid
    if (result === null) {
      return API.resetPassword({ id: this.state.id, password: self.refs.password.value }).then((result) => {
        switch (result.msg) {
          case 'PASSWORD_WAS_RESET_AND_EMAIL_SENT':
            this.setState({ errMsg: 'Your password has been reset. You can login now with the new password' })
            break
          case 'PASSWORD_WAS_RESET_AND_EMAIL_NOT_SENT':
            this.setState({ errMsg: 'Your password has been reset but failed to send email. You can login now with the new password' })
            break
          case 'PASSWORD_WAS_NOT_RESET':
            this.setState({ errMsg: 'Failed to reset password. Please try again' })
            break
          default:
            this.setState({ errMsg })
        }
      }).catch((errMsg) => {

      })
    } else {
      this.setErrors(result)
    }
  }

  render() {
    const requiredLabel = (<abbr className='dk-red-text'>&nbsp;*</abbr>)
    if (this.state.isValid) {
      return (
        <div className='subscribe-wrapper'>
          <div className='reset-password-container'>
            <div className='form-subscribe'>
              <h3>Please enter your new password</h3>
              <form className='form form-subscribe-login'>
                <div className={['form-group', this.errors.password ? 'has-error' : ''].join(' ')}>
                  <label htmlFor='contact-name'>Password{requiredLabel}</label>
                  <input className='form-control' name='password' id='password' required='' type='password' ref='password' />
                  <span className={[this.errors.password ? 'help-block' : 'hide'].join(' ')}>{this.errors.password}</span>
                </div>
                <div className={['form-group', this.errors.confirmPassword ? 'has-error' : ''].join(' ')}>
                  <label htmlFor='contact-name'>Confirm Password{requiredLabel}</label>
                  <input className='form-control' name='confirm_password' id='confirm_password' required='' type='password' ref='confirmPassword' />
                  <span className={[this.errors.confirmPassword ? 'help-block' : 'hide'].join(' ')}>{this.errors.confirmPassword}</span>
                </div>
                <div className={['form-group', this.state.errMsg ? 'has-error' : 'hide'].join(' ')}>
                  <span className='help-block'>{this.state.errMsg}</span>
                </div>
                <div className='form-group'>
                  <button type='button' className='btn btn-block dk-bg-blue dk-white' onClick={() => this.submitForm()}>Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className='subscribe-wrapper'>
          <div className='reset-password-container'>
            <div className='form-subscribe'>
              <h3>User not found!</h3>
            </div>
          </div>
        </div>
      )
    }
  }

}

PageContent.propTypes = {}

export default PageContent
