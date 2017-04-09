import React from 'react'

class Step1SignIn extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  render () {
    return (
      <div className='subscription-assign-student-container'>
        <div className='alert alert-success'>
          <p>Congrats! You have successfully subscribed to a plan. Now please create a <strong>Student Account</strong> for your child to start enjoyning it.</p>
          <br />
          <p>You can also do it later by accessing to <a href=''>My Subscription</a> page</p>
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
                  <div className='form-group'>
                    <label htmlFor='contact-name'>First Name*</label>
                    <input className='form-control' name='fname' id='fname' required='' type='text' />
                  </div>
                </div>
                <div className='col-sm-6 col-xs-12'>
                  <div className='form-group'>
                    <label htmlFor='contact-name'>Last Name*</label>
                    <input className='form-control' name='lname' id='lname' required='' type='text' />
                  </div>
                </div>
                <div className='col-sm-6 col-xs-12'>
                  <div className='form-group'>
                    <label htmlFor='contact-name'>Email address*</label>
                    <input className='form-control' name='email' id='email' required='' type='text' />
                  </div>
                </div>
                <div className='col-sm-6 col-xs-12'>
                  <div className='form-group'>
                    <label htmlFor='contact-name'>School</label>
                    <input className='form-control' name='school' id='school' type='text' />
                  </div>
                </div>
                <div className='col-sm-6 col-xs-12'>
                  <div className='form-group'>
                    <label htmlFor='contact-name'>Level</label>
                    <select className='form-control' name='level' id='level'>
                      <option value='P1'>P1</option>
                      <option value='P2'>P2</option>
                      <option value='P3'>P3</option>
                    </select>
                  </div>
                </div>
                <div className='col-sm-6 col-xs-12'>
                  <div className='form-group'>
                    <label htmlFor='contact-name'>Year of Birth</label>
                    <select className='form-control' name='year_of_birth' id='year_of_birth' required=''>
                      <option value='2017'>2017</option>
                      <option value='2018'>2018</option>
                      <option value='2019'>2019</option>
                      <option value='2020'>2020</option>
                    </select>
                  </div>
                </div>
                <div className='col-sm-6 col-xs-12'>
                  <div className='form-group'>
                    <label htmlFor='contact-name'>Password*</label>
                    <input className='form-control' name='password' id='password' type='password' />
                  </div>
                </div>
                <div className='col-sm-6 col-xs-12'>
                  <div className='form-group'>
                    <label htmlFor='contact-name'>Confirm Password</label>
                    <input className='form-control' name='confirm_password' id='confirm_password' type='password' />
                  </div>
                </div>
                <div className='col-xs-12'>
                  <div className='form-group'>
                    <button type='button' className='btn dk-bg-blue dk-white'>Complete Assignment</button>
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
