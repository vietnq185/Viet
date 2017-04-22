import React from 'react'

import Utils from '../../../helpers/utils'

class Step1SignIn extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  submitForm () {
    this.props.changeStep(this.props.steps.success)
  }

  render () {
    console.info('Subscribe => PageContent => SignIn component => props: ', this.props)
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
                <div className='col-sm-6 col-xs-12'>
                  <div className='form-group'>
                    <label htmlFor='contact-name'>Email Address</label>
                    <input className='form-control' name='email' id='email' required='' type='text' />
                  </div>
                </div>
                <div className='col-sm-6 col-xs-12'>
                  <div className='form-group'>
                    <label htmlFor='contact-name'>Linkcode <span className='linkcode-info'><a href='javascript:void(0);' data-toggle='tooltip' data-placement='top' title="Please log in to YOUR CHILD's student account then go to 'My Profile' to get the 6-character linkcode"><i className='fa fa-info-circle' /></a></span></label>
                    <input className='form-control' name='lname' id='lname' required='' type='text' />
                  </div>
                </div>
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
