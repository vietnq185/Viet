import React from 'react'
import Joi from 'joi'

import config from '../../../config'
import Utils from '../../../helpers/utils'
import validate from '../../../helpers/validate'

class Step1SignUp extends React.Component {
  constructor (props) {
    super(props)
    this.initialErrors = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
    this.errors = Utils.copy(this.initialErrors)
    this.state = {
      hasError: false,
      errMsg: ''
    }
  }

  resetErrors () {
    this.errors = Utils.copy(this.initialErrors)
    this.setState({ hasError: false, errMsg: '' })
  }

  setErrors (errors) {
    this.errors = errors
    this.setState({ hasError: true, errMsg: '' })
  }

  extractdata () {
    const data = {}
    for (let field in this.refs) {
      if (this.refs.hasOwnProperty(field)) {
        data[field] = this.refs[field].value || ''
      }
    }
    return data
  }

  submitForm () {
    this.resetErrors()

    const rules = {
      firstName: Joi.string().required().label('First name'),
      lastName: Joi.string().required().label('Last name'),
      phone: Joi.string().optional(),
      email: Joi.string().required().email().label('Email'),
      password: Joi.string().required().min(8).max(50).label('Password'),
      confirmPassword: Joi.any().valid(Joi.ref('password')).required().options({
        language: {
          any: {
            allowOnly: 'must match password'
          }
        }
      }).label('Password confirmation')
    }

    const result = validate(rules, this.refs)  // result === true -> valid, result === error object -> invalid
    if (result === true) {
      // can submit
      console.info('can submit form')
      fetch(config.api.signUp, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(this.extractdata())
      }).then((response) => response.json()).then((jsonResponse) => {
        if (jsonResponse && jsonResponse.success) {
          console.info('sign up success: ', jsonResponse)
          // do login automatically
          return
        }
        // parse error msg
        console.info('sign up error: ', jsonResponse)
        const msg = jsonResponse.error.message || ''
        switch (msg) {
          case 'REGISTERED_EMAIL':
            this.setState({ errMsg: 'The email has been registered by another person.' })
            break
          case 'REGISTERED_USER':
            this.setState({ errMsg: 'The username has been registered by another person.' })
            break
          default:
            this.setState({ errMsg: 'Server is busy, please try again later.' })
        }
      }).catch((error) => {
        this.setState({ errMsg: 'Server is busy, please try again later.' })
        console.info('sign up error: ', error)
      })
      //
    } else {
      this.setErrors(result)
    }
  }

  render () {
    return (
      <div className='form-subscribe'>
        <div className='form-title'>Sign Up for Parent Account</div>
        <div className='form-title-desc text-center'>Please enter the following information to create a parent account.</div>
        <br />
        <form className='form form-subscribe-register'>
          <div className='row'>
            <div className='col-sm-6 col-xs-12'>
              <div className={['form-group', this.errors.firstName ? 'has-error' : ''].join(' ')}>
                <label htmlFor='contact-name'>First Name</label>
                <input className='form-control' name='first_name' id='first_name' required='' type='text' ref='firstName' />
                <span className={[this.errors.firstName ? 'help-block' : 'hide'].join(' ')}>{this.errors.firstName}</span>
              </div>
            </div>
            <div className='col-sm-6 col-xs-12'>
              <div className={['form-group', this.errors.lastName ? 'has-error' : ''].join(' ')}>
                <label htmlFor='contact-name'>Last Name</label>
                <input className='form-control' name='last_name' id='last_name' required='' type='text' ref='lastName' />
                <span className={[this.errors.lastName ? 'help-block' : 'hide'].join(' ')}>{this.errors.lastName}</span>
              </div>
            </div>
          </div>
          <div className={['form-group', this.errors.email ? 'has-error' : ''].join(' ')}>
            <label htmlFor='contact-name'>Email Address</label>
            <input className='form-control' name='email' id='email' required='' type='text' ref='email' />
            <span className={[this.errors.email ? 'help-block' : 'hide'].join(' ')}>{this.errors.email}</span>
          </div>
          <div className={['form-group'].join(' ')}>
            <label htmlFor='contact-name'>Phone Number</label>
            <input className='form-control' name='phone' id='phone' required='' type='text' ref='phone' />
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
          <div className={['form-group'].join(' ')}>
            <button type='button' className='btn btn-block dk-bg-blue dk-white' onClick={() => this.submitForm()}>Sign Up</button>
          </div>
          <div className='form-group text-center signup-term'>
            By Signing up, you agree and consent to the<br /><a href='javascript:void(0);' data-toggle='modal' data-target='#modalTermsConditions'>Terms of Service and Provacy Policy</a>
          </div>
          <div className='form-group text-center'>
            Alreay have an account?&nbsp;
            <a href='javascript: void(0);' onClick={() => this.props.changeStep(this.props.steps.signIn)}>Sign In</a>
          </div>
        </form>

        {/* <!-- Modal --> */}
        <div id='modalTermsConditions' className='modal fade' role='dialog'>
          <div className='modal-dialog'>

            {/* <!-- Modal content--> */}
            <div className='modal-content'>
              <div className='modal-header'>
                <button type='button' className='close' data-dismiss='modal'>&times;</button>
              </div>
              <div className='modal-body'>
                <h3>Terms of Service:</h3>
                <div className='terms-of-service pre-scrollable'>
                  <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>
                  <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>
                </div><br />
                <h3>Privacy Policy:</h3>
                <div className='privacy-policy pre-scrollable'>
                  <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>
                  <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>
                </div>
                <div className='text-center'><button className='btn dk-bg-green dk-white btn-close-modal' type='button' data-dismiss='modal'>CLOSE</button></div>
              </div>
            </div>

          </div>
        </div>

      </div>
    )
  }
}

Step1SignUp.propTypes = {
  steps: React.PropTypes.object.isRequired,
  changeStep: React.PropTypes.func.isRequired
}

export default Step1SignUp
