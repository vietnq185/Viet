/* eslint-disable */
import React from 'react'
import { IndexLink, Link } from 'react-router'

import constants from '../../../constants'
import API from '../../../helpers/api'
import Utils from '../../../helpers/utils'
import * as authActions from '../../../store/auth'
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
    Utils.redirect('/subscription')
  }

  render() {
    console.info('Subscribe => PageContent => Success component => props: ', this.props)

    const objSubscription = this.props.subscriptionResult.result;

    const { assignment } = this.props;

    console.info('Subscribe => PageContent => Success component => objSubscription: ', objSubscription)

    console.info('Subscribe => PageContent => Success component => assignment: ', assignment)

    const studentLoginLink = (
      <span>
        <br /><br />or sign into <strong>Student Account</strong> to enjoy free trial version
          <br /><br /><a href='https://app.a-smartlearning.com/en/sml/login' className='btn dk-bg-blue dk-white'>Sign into student account</a>
      </span>
    )
    var zpad = require('zpad')
    let _refid = (objSubscription._id.substring(0, 7) + '...')
    if (objSubscription.refid !== '') {
      _refid = zpad(objSubscription.refid, 6)
    }
    // const studentLogin = this.props.assignment && this.props.assignment.success ? studentLoginLink : ''
    const studentLogin = studentLoginLink

    let detailsLink = (<p>Thanks for signing up with us.</p>)
    if (objSubscription.numberOfSubscriptions > 1) {
      detailsLink = ''
    }

    let channelStripe = (
      <div className='thank-you-msg'>
        {detailsLink}
        <p>You can check all your subscriptions in My Subscription page.</p>
      </div>
    )

    const isFromListPage = (Utils.isNotEmptyObject(assignment) && assignment.isFromListPage);

    const alreadyAssigned = (Utils.isNotEmptyObject(assignment) && assignment.success && objSubscription._id === assignment.subscriptionId && (!!assignment.studentId))

    if (alreadyAssigned) {
      if (isFromListPage) {
        channelStripe = (
          <div className='thank-you-msg'>
            <p>The subscription has been assigned to a student.</p>
            <p>You can check all your subscriptions in My Subscription page.</p>
          </div>
        )
      }
      else {
        channelStripe = (
          <div className='thank-you-msg'>
            {detailsLink}
            <p>The subscription has been assigned to a student.</p>
            <p>You can check all your subscriptions in My Subscription page.</p>
          </div>
        )
      }
    }

    const channelBank = (
      <div className='thank-you-msg'>
        {detailsLink}
        <p>We will contact you via phone to confirm your subscription and give you futher instruction.</p>
        <p>For instant information, please contact us via: +65 7432 3421.</p>
        <p>You can check all your subscription in My Subscription page.</p>
      </div>
    )

    const channelMsg = (objSubscription.channel === constants.paymentMethod.creditCard ? channelStripe : channelBank)

    return (
      <div className='subscribe-success-content'>
        <p><img src={successImage} /></p>
        <h1>SUCCESS!</h1>
        {channelMsg}
        <br /><a href='/subscription' className='btn dk-bg-green dk-white' /*onClick={() => this.showSubscription()}*/>See your subscription</a>
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
