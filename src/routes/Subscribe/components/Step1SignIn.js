import React from 'react'

class Step1SignIn extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  render () {
    console.info('Subscribe => PageContent => SignIn component => props: ', this.props)
    return (
      <div className='form-subscribe'>
        <div className='form-title'>Sign In</div>
        <div className='form-title-desc text-center'>If you have a parent account with us, please sign in.</div>
        <br />
        <form className='form form-subscribe-login'>
          <div className='form-group'>
            <label htmlFor='contact-name'>Email address</label>
            <input className='form-control' name='email' id='email' required='' type='text' />
          </div>
          <div className='form-group'>
            <label htmlFor='contact-name'>Password</label>
            <input className='form-control' name='password' id='password' required='' type='password' />
            <span className='forgot-password'><a href='javascript: void(0);'>Forgot password?</a></span>
          </div>
          <div className='form-group'>
            <button type='button' className='btn btn-block dk-bg-blue dk-white'>Sign In</button>
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
  changeStep: React.PropTypes.func.isRequired
}

export default Step1SignIn
