/* eslint-disable */
import React from 'react'

import API from '../../../helpers/api'
import Utils from '../../../helpers/utils'
import validate from '../../../helpers/validate'

class Step1SignIn extends React.Component {
  constructor(props) {
    super(props)
    this.initialErrors = {
      email: '',
      linkCode: ''
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
    return data
  }

  submitForm() {
    const self = this

    this.resetErrors()

    const rules = {
      email: {
        required: 'Email is required',
        email: 'Invalid email address'
      },
      linkCode: {
        required: 'Link Code is required'
      }
    }

    const result = validate(rules, this.refs)  // result === null -> valid, result === error object -> invalid

    if (result === null) {
      // can submit
      console.info('can submit form link student')
      const { accessToken, userId } = self.props.auth.jwt // eslint-disable-line
      API.linkStudent(accessToken, this.extractdata()).then((jsonResponse) => {
        console.info('linkstudent => result: ', jsonResponse)
        // do assignment
        API.assignStudent(accessToken, {
          subscriptionId: self.props.assignment.subscriptionId,
          studentId: jsonResponse._id
        }).then((result) => {
          self.props.assignStudent({ studentId: jsonResponse._id, success: true })
          self.props.changeStep(self.props.steps.success)
        }).catch((errMsg) => {
          // this.setState({ errMsg })
          this.setState({ errMsg: 'Cannot link student. Please try again later' })
        })
        // END - do login
      }).catch((errMsg) => {
        console.info('linkstudent => errMsg: ', errMsg)
        const predefinedMsg = {
          YOU_ARE_NOT_PARENT: 'This functionality allows for parent account only',
          UNREGISTERED_STUDENT: 'The student account has not register yet',
          LINK_CODE_NOT_FOUND: 'Incorrect link code',
          ALREADY_LINKED_BEFORE: 'The student has been already linked before',
          ALREADY_LINKED_TO_ANOTHER_PARENT: 'The student has been already linked to another parent account before'
        };
        this.setState({ errMsg: (typeof predefinedMsg[errMsg] !== 'undefined' ? predefinedMsg[errMsg] : errMsg) })
      })
      //
    } else {
      this.setErrors(result)
    }
  }

  render() {
    console.info('Subscribe => PageContent => SignIn component => props: ', this.props)
    const requiredLabel = (<abbr className='dk-red-text'>&nbsp;*</abbr>)
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
            <p>Please select an already-linked student account or enter student's Email Address and Linkcode into the form below.</p>
            <p>Do not have a student account? <a href='javascript: void(0);' onClick={() => this.props.changeStep(this.props.steps.createStudent)}>Create a new student</a></p>
            <form action='' method='post'>
              <div className='row'>
                <div className='col-xs-12'>
                  <div className='form-group add-student-account'>
                    <input type='radio' name='add_student_account' id='add_student_account' value='1' defaultChecked />
                    <label htmlFor='add_student_account'>Add student account</label>
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
                  <div className={['form-group', this.errors.linkCode ? 'has-error' : ''].join(' ')}>
                    <label htmlFor='contact-name'>Linkcode{requiredLabel} <span className='linkcode-info'><a href='javascript:void(0);' data-toggle='tooltip' data-placement='top' title="Please log in to YOUR CHILD's student account then go to 'My Profile' to get the 6-character linkcode"><i className='fa fa-info-circle' /></a></span></label>
                    <input className='form-control' name='linkCode' id='linkCode' required='' type='text' ref='linkCode' />
                    <span className={[this.errors.linkCode ? 'help-block' : 'hide'].join(' ')}>{this.errors.linkCode}</span>
                  </div>
                </div>
              </div>
              <div className={['form-group', this.state.errMsg ? 'has-error' : 'hide'].join(' ')}>
                <span className='help-block'>{this.state.errMsg}</span>
              </div>
              <div className='row'>
                <div className='col-xs-12'><br /><br />
                  <div className='form-group'>
                    <button type='button' className='btn dk-bg-blue dk-white' onClick={() => this.submitForm()}>Complete Assignment</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

Step1SignIn.propTypes = {
  steps: React.PropTypes.object.isRequired,
  changeStep: React.PropTypes.func.isRequired
}

export default Step1SignIn
