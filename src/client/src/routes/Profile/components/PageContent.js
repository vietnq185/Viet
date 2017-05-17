/* eslint-disable */
import React from 'react'
import { fadeIn } from 'react-animations'
import { StyleSheet, css } from 'aphrodite'
import Utils from '../../../helpers/utils'
import API from '../../../helpers/api'
import * as authActions from '../../../store/auth'
import validate from '../../../helpers/validate'
import IntlTelInput from 'react-bootstrap-intl-tel-input'

const styles = StyleSheet.create({
  fadeIn: {
    animationName: fadeIn,
    animationDuration: '1s'
  }
})

class PageContent extends React.Component {
  constructor(props) {
    super(props)
    this.initialErrors = {
      firstName: '',
      lastName: '',
      phone: '',
      password: '',
      confirmPassword: ''
    }
    this.errors = Utils.copy(this.initialErrors)
    this.state = {
      hasError: false,
      errMsg: '',
      showConfirmUpdate: false,
      phoneNumber: props.auth.user.phone
    }
  }

  resetErrors() {
    this.errors = Utils.copy(this.initialErrors)
    this.setState({ hasError: false, errMsg: '' })
  }

  setErrors(errors) {
    this.errors = errors
    this.setState({ hasError: true, errMsg: '' })
  }

  extractdata() {
    const data = {}
    for (let field in this.refs) {
      if (this.refs.hasOwnProperty(field)) {
        if (field !== 'password' || field === 'password' && this.refs[field].value !== '') {
          data[field] = this.refs[field].value || ''
        }
      }
    }
    return data
  }

  onCloseUpdate() {
    this.setState({ showConfirmUpdate: false })
    window.location.reload()
  }

  submitForm() {
    const self = this

    this.resetErrors()

    const rules = {
      firstName: {
        required: 'First name is required',
        maxLen: {
          value: 20,
          msg: 'First Name length must be less than or equal to {value} characters long'
        },
      },
      lastName: {
        required: 'Last name is required',
        maxLen: {
          value: 20,
          msg: 'last Name length must be less than or equal to {value} characters long'
        },
      },
      phone: {
        required: 'Please enter a valid phone number'
      },
      password: {
        minLen: {
          value: 6,
          msg: 'Password length must be at least {value} characters long'
        },
        maxLen: {
          value: 32,
          msg: 'Password length must be less than or equal to {value} characters long'
        },
      },
      confirmPassword: {
        match: {
          ref: 'password',
          msg: 'Confirm password does not match'
        }
      }
    }

    const result = validate(rules, this.refs, false)  // result === null -> valid, result === error object -> invalid

    if (result === null) {
      return authActions.checkAccessToken().then((jwt) => {
        API.updateProfile(jwt.accessToken || '', this.props.auth.user._id, this.extractdata()).then((jsonResponse) => {
          this.setState({ showConfirmUpdate: true })
        }).catch((errMsg) => {
          this.setState({ showConfirmUpdate: false })
          this.setState({ errMsg })
        })
      }).catch((error) => {
        console.info('changeSubscriptionStatus => checkAccessToken => error: ', error)
      })
      //
    } else {
      this.setErrors(this.generateErrorList(result))
    }
  }

  generateErrorList(objErrors) {
    const newErrors = {};
    for (let key in objErrors) {
      if (objErrors.hasOwnProperty(key)) {
        newErrors[key] = Object.values(objErrors[key]).map(errItem => {
          return (<span key={Utils.uuid()} style={{ display: 'block', marginBottom: '5px' }}>{errItem}</span>);
        });
      }
    }
    return newErrors;
  }

  onPhoneChangeHandler(data) {
    if (data.valid !== undefined && data.valid) {
      this.setState({ phoneNumber: data.intlPhoneNumber })
    } else {
      this.setState({ phoneNumber: '' })
    }
  }

  render() {
    const requiredLabel = (<abbr className='dk-red-text'>&nbsp;*</abbr>)
    if (this.props.auth.isLoggedIn) {
      const { auth } = this.props
      return (
        <div className='subscribe-wrapper'>
          <div className='form-profile-container'>
            <div className='form-title'>Update profile</div>
            <form className='form form-profile'>
              <div className='row'>
                <div className='col-sm-6 col-xs-12'>
                  <div className={['form-group', this.errors.firstName ? 'has-error' : ''].join(' ')}>
                    <label htmlFor='contact-name'>First Name{requiredLabel}</label>
                    <input className='form-control' name='first_name' id='first_name' defaultValue={auth.user.firstName} required='' type='text' ref='firstName' />
                    <span className={[this.errors.firstName ? 'help-block' : 'hide'].join(' ')}>{this.errors.firstName}</span>
                  </div>
                </div>
                <div className='col-sm-6 col-xs-12'>
                  <div className={['form-group', this.errors.lastName ? 'has-error' : ''].join(' ')}>
                    <label htmlFor='contact-name'>Last Name{requiredLabel}</label>
                    <input className='form-control' name='last_name' id='last_name' defaultValue={auth.user.lastName} required='' type='text' ref='lastName' />
                    <span className={[this.errors.lastName ? 'help-block' : 'hide'].join(' ')}>{this.errors.lastName}</span>
                  </div>
                </div>
              </div>
              <div className={['form-group', this.errors.phone ? 'has-error' : ''].join(' ')}>
                <label htmlFor='contact-name'>Phone Number{requiredLabel}</label>
                <input className='form-control hide' name='phone' id='phone' value={this.state.phoneNumber} required='' type='text' ref='phone' />
                <IntlTelInput
                  preferredCountries={['SG']}
                  defaultCountry={'SG'}
                  placeholder={'+6599999999'}
                  onChange={(data) => this.onPhoneChangeHandler(data)}
                  defaultValue={auth.user.phone}
                />
                <span className={[this.errors.phone ? 'help-block' : 'hide'].join(' ')}>{this.errors.phone}</span>
              </div>
              <div className={['form-group', this.errors.password ? 'has-error' : ''].join(' ')}>
                <label htmlFor='contact-name'>Password</label>
                <input className='form-control' name='password' id='password' required='' type='password' ref='password' />
                <span className={[this.errors.password ? 'help-block' : 'hide'].join(' ')}>{this.errors.password}</span>
              </div>
              <div className={['form-group', this.errors.confirmPassword ? 'has-error' : ''].join(' ')}>
                <label htmlFor='contact-name'>Confirm Password</label>
                <input className='form-control' name='confirm_password' id='confirm_password' required='' type='password' ref='confirmPassword' />
                <span className={[this.errors.confirmPassword ? 'help-block' : 'hide'].join(' ')}>{this.errors.confirmPassword}</span>
              </div>
              <div className={['form-group', this.state.errMsg ? 'has-error' : 'hide'].join(' ')}>
                <span className='help-block'>{this.state.errMsg}</span>
              </div>
              <div className={['form-group', 'text-center'].join(' ')}>
                <button type='button' className='btn dk-bg-blue dk-white' onClick={() => this.submitForm()}>Update profile</button>
              </div>
            </form>

          </div>

          <div id='modalConfirmUpdateProfile' aria-hidden='false' className={['modal fade', this.state.showConfirmUpdate ? 'in' : '', css(styles.fadeIn)].join(' ')} role='dialog' style={this.state.showConfirmUpdate ? { display: 'block' } : { display: 'none' }}>
            <div className='modal-dialog'>
              {/* <!-- Modal content--> */}
              <div className='modal-content'>
                <div className='modal-header'>
                  <span className='modalConfirmUpdateProfileTitle'>Info:</span>
                  <button type='button' className='close' data-dismiss='modal' onClick={() => this.onCloseUpdate()}>&times;</button>
                </div>
                <div className='modal-body'>
                  <p className='text-center'>You profile has been updated!</p><br />
                  <div className='text-center'>
                    <a className='btn dk-bg-green dk-white' href='javascript: void(0);' onClick={() => this.onCloseUpdate()}>Close</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      )
    } else {
      return (
        <div className='subscribe-wrapper'>
          <div className='container'><h3>You have not logged in!</h3></div>
        </div>
      )
    }
  }

}

PageContent.propTypes = {}

export default PageContent
