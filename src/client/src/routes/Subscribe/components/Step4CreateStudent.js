/* eslint-disable */
import React from 'react'

import API from '../../../helpers/api'
import Utils from '../../../helpers/utils'
import validate from '../../../helpers/validate'

class Step4CreateStudent extends React.Component {
  constructor(props) {
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
        data[field] = this.refs[field].value || ''
      }
    }
    const { userId, isParent } = this.props.auth.jwt || {} // eslint-disable-line
    if (userId && isParent) {
      data.parentId = userId
    }
    data.status = ['student']
    data.metadata = {
      class: (this.refs.class.value || ''),
      school: (this.refs.school.value || ''),
      yearOfBirth: (this.refs.yearOfBirth.value || '')
    }
    return data
  }

  submitForm() {
    const self = this

    this.resetErrors()

    const rules = {
      firstName: {
        required: 'First name is required'
      },
      lastName: {
        required: 'Last name is required'
      },
      email: {
        required: 'Email is required',
        email: 'Invalid email address'
      },
      password: {
        required: 'Password is required'
      },
      confirmPassword: {
        match: {
          ref: 'password',
          msg: 'Confirm password does not match'
        }
      }
    }

    const result = validate(rules, this.refs)  // result === null -> valid, result === error object -> invalid

    if (result === null) {
      // can submit
      console.info('can submit form')
      API.register(this.extractdata()).then((jsonResponse) => {
        const { accessToken, userId } = self.props.auth.jwt || {} // eslint-disable-line
        // do assignment
        API.assignStudent(accessToken, {
          subscriptionId: self.props.assignment.subscriptionId,
          studentId: jsonResponse._id
        }).then((result) => {
          self.props.assignStudent({ studentId: jsonResponse._id, success: true })
          self.props.changeStep(self.props.steps.success)
        }).catch((errMsg) => {
          // this.setState({ errMsg })
          this.setState({ errMsg: 'Cannot create student. Please try again later' })
        })
        // END - do login
      }).catch((errMsg) => {
        switch (errMsg) {
          case 'REGISTERED_EMAIL':
            this.setState({ errMsg: 'The email has been registered by another person.' })
            break
          case 'REGISTERED_USER':
            this.setState({ errMsg: 'The username has been registered by another person.' })
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

  render() {
    const requiredLabel = (<abbr className='dk-red-text'>&nbsp;*</abbr>)
    const currentYear = new Date().getFullYear()
    const yearList = []
    for (let year = currentYear; year > currentYear - 50; year--) { // eslint-disable-line
      yearList.push(<option key={`year${year}`} value={year}>{year}</option>)
    }
    return (
      <div className='subscription-assign-student-container'>
        <div className='alert alert-success'>
          <p>Congrats! You have successfully subscribed to a plan. Now please create a <strong>Student Account</strong> for your child to start enjoyning it.</p>
          <br />
          <p>You can also do it later by accessing to <a href='javascript: void(0);' onClick={() => Utils.redirect('/subscription')}>My Subscription</a> page</p>
        </div>
        <div className='subscription-assign-student'>
          <div className='row'>
            <div className='col-xs-12'>
              <h2>Student Account</h2>
            </div>
          </div>
          <hr />
          <div className='subscription-assign-student-form'>
            <p>Please Sign Up for a student account by entering the information below</p>
            <p>Already have a student account? <a href='javascript: void(0);' onClick={() => this.props.changeStep(this.props.steps.linkStudent)}>Link account now</a></p>
            <form action='' method='post'>
              <div className='row'>
                <div className='col-sm-6 col-xs-12'>
                  <div className={['form-group', this.errors.firstName ? 'has-error' : ''].join(' ')}>
                    <label htmlFor='contact-name'>First Name{requiredLabel}</label>
                    <input className='form-control' name='first_name' id='first_name' required='' type='text' ref='firstName' />
                    <span className={[this.errors.firstName ? 'help-block' : 'hide'].join(' ')}>{this.errors.firstName}</span>
                  </div>
                </div>
                <div className='col-sm-6 col-xs-12'>
                  <div className={['form-group', this.errors.lastName ? 'has-error' : ''].join(' ')}>
                    <label htmlFor='contact-name'>Last Name{requiredLabel}</label>
                    <input className='form-control' name='last_name' id='last_name' required='' type='text' ref='lastName' />
                    <span className={[this.errors.lastName ? 'help-block' : 'hide'].join(' ')}>{this.errors.lastName}</span>
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col-sm-6 col-xs-12'>
                  <div className={['form-group', this.errors.email ? 'has-error' : ''].join(' ')}>
                    <label htmlFor='contact-name'>Email Address{requiredLabel}</label>
                    <input className='form-control' name='email' id='email' required='' type='text' ref='email' />
                    <span className={[this.errors.email ? 'help-block' : 'hide'].join(' ')}>{this.errors.email}</span>
                  </div>
                </div>
                <div className='col-sm-6 col-xs-12'>
                  <div className='form-group'>
                    <label htmlFor='contact-name'>School</label>
                    <input className='form-control' name='school' id='school' type='text' ref='school' />
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col-sm-6 col-xs-12'>
                  <div className='form-group'>
                    <label htmlFor='contact-name'>Level</label>
                    <select className='form-control' name='level' id='level' ref='class'>
                      <option value='P1'>P1</option>
                      <option value='P2'>P2</option>
                      <option value='P3'>P3</option>
                    </select>
                  </div>
                </div>
                <div className='col-sm-6 col-xs-12'>
                  <div className='form-group'>
                    <label htmlFor='contact-name'>Year of Birth</label>
                    <select className='form-control' name='year_of_birth' id='year_of_birth' required='' ref='yearOfBirth'>
                      {yearList}
                    </select>
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col-sm-6 col-xs-12'>
                  <div className={['form-group', this.errors.password ? 'has-error' : ''].join(' ')}>
                    <label htmlFor='contact-name'>Password{requiredLabel}</label>
                    <input className='form-control' name='password' id='password' required='' type='password' ref='password' />
                    <span className={[this.errors.password ? 'help-block' : 'hide'].join(' ')}>{this.errors.password}</span>
                  </div>
                </div>
                <div className='col-sm-6 col-xs-12'>
                  <div className={['form-group', this.errors.confirmPassword ? 'has-error' : ''].join(' ')}>
                    <label htmlFor='contact-name'>Confirm Password{requiredLabel}</label>
                    <input className='form-control' name='confirm_password' id='confirm_password' required='' type='password' ref='confirmPassword' />
                    <span className={[this.errors.confirmPassword ? 'help-block' : 'hide'].join(' ')}>{this.errors.confirmPassword}</span>
                  </div>
                </div>
              </div>
              <div className={['form-group', this.state.errMsg ? 'has-error' : 'hide'].join(' ')}>
                <span className='help-block'>{this.state.errMsg}</span>
              </div>
              <div className='row'>
                <div className='col-xs-12'>
                  <div className='form-group'>
                    <button type='button' className='btn dk-bg-blue dk-white' onClick={() => this.submitForm()}>Complete Assignment</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div >
    )
  }
}

Step4CreateStudent.propTypes = {
  steps: React.PropTypes.object.isRequired,
  changeStep: React.PropTypes.func.isRequired
}

export default Step4CreateStudent
