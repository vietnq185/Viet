/* eslint-disable */
import React from 'react'

import Utils from '../../../helpers/utils'

import successImage from '../../../styles/images/icon-success.png'
import appleImage from '../../../styles/images/ico-app-store.png'
import androidImage from '../../../styles/images/ico-google-play.png'

class Step1SignIn extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  showSubscription() {
    this.props.restart()
    Utils.redirect('subscription')
  }

  render() {
    console.info('Subscribe => PageContent => Success component => props: ', this.props)
    const studentLogin = this.props.assignment && this.props.assignment.success ? (
      <span>
        <br /><br />or sign into <strong>Student Account</strong> to enjoy free trial version
          <br /><br /><a href='https://app.a-smartlearning.com/en/sml/login' className='btn dk-bg-blue dk-white'>Sign into student account</a>
      </span>
    ) : ''
    return (
      <div className='subscribe-success-content'>
        <p><img src={successImage} /></p>
        <h1>SUCCESS!</h1>
        <div className='thank-you-msg'>
          <p>The subscription has been assigned to a student.</p>
          <p>You can check all your subscriptions in My Subscription page</p>
        </div>
        <br /><br /><a href='javascript: void(0);' className='btn dk-bg-green dk-white' onClick={() => this.showSubscription()}>See your subscription</a>
        {studentLogin}
        <br /><br /><br />Download <strong>Parent App</strong> for iOS or Android and enjoy the learning journey with your child
        <br /><br />
        <span className='ico-google-play'><a href='https://play.google.com/store/apps/details?id=com.inspicorp.sls_android' target='_blank'><img src={androidImage} /></a></span>
        <span className='ico-app-store'><a href='https://itunes.apple.com/us/app/a-sls/id1128693154?ls=1&mt=8' target='_blank'><img src={appleImage} /></a></span>
      </div>
    )
  }
}

Step1SignIn.propTypes = {
  steps: React.PropTypes.object.isRequired,
  changeStep: React.PropTypes.func.isRequired
}

export default Step1SignIn
