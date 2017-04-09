import React from 'react'

class Step1SignUp extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
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
              <div className='form-group'>
                <label htmlFor='contact-name'>First Name</label>
                <input className='form-control' name='first_name' id='first_name' required='' type='text' />
              </div>
            </div>
            <div className='col-sm-6 col-xs-12'>
              <div className='form-group'>
                <label htmlFor='contact-name'>Last Name</label>
                <input className='form-control' name='last_name' id='last_name' required='' type='text' />
              </div>
            </div>
          </div>
          <div className='form-group'>
            <label htmlFor='contact-name'>Email Address</label>
            <input className='form-control' name='email' id='email' required='' type='text' />
          </div>
          <div className='form-group'>
            <label htmlFor='contact-name'>Phone Number</label>
            <input className='form-control' name='phone' id='phone' required='' type='text' />
          </div>
          <div className='form-group'>
            <label htmlFor='contact-name'>Password</label>
            <input className='form-control' name='password' id='password' required='' type='password' />
          </div>
          <div className='form-group'>
            <label htmlFor='contact-name'>Confirm Password</label>
            <input className='form-control' name='confirm_password' id='confirm_password' required='' type='password' />
          </div>
          <div className='form-group'>
            <button type='button' className='btn btn-block dk-bg-blue dk-white'>Sign Up</button>
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
