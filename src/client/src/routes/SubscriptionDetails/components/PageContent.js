/* eslint-disable */
import React from 'react'

import API from '../../../helpers/api'
import Utils from '../../../helpers/utils'
import * as authActions from '../../../store/auth'
import SubscriptionCancelled from './SubscriptionCancelled'
import SubscriptionTrailing from './SubscriptionTrailing'
import SubscriptionOverdue from './SubscriptionOverdue'
import SubscriptionPending from './SubscriptionPending'
import SubscriptionActive from './SubscriptionActive'

class PageContent extends React.Component {
  constructor(props) {
    super(props)
    this.initialSubscription = {}
    this.state = {
      id: this.props.params.id || '',
      subscription: Utils.copy(this.initialSubscription)
    }
  }

  componentDidMount() {
    var self = this
    return authActions.checkAccessToken().then((jwt) => {
      API.getSubscriptionDetails(jwt.accessToken || '', this.state.id).then((subscription) => this.setState({ subscription })).catch((error) => {
        console.info('what the error: ', error)
        self.setState({ subscription: Utils.copy(self.initialSubscription) })
      })
    }).catch((error) => {
      console.info('changeSubscriptionStatus => checkAccessToken => error: ', error)
    })
  }

  assignSubscription(item) {
    this.props.restart()
    this.props.updateSubscriptionResult({ success: false, result: item, err: null })
    this.props.assignStudent({ subscriptionId: item._id })
    this.props.changeStep(this.props.subscribe.steps.linkStudent)
    Utils.redirect('/subscribe')
  }

  render() {
    var objSubscription = this.state.subscription
    if (this.props.auth.isLoggedIn) {
      let subscriptionDetails = ''
      if (objSubscription.msg != undefined && objSubscription.msg == 'SUBSCRIPTION_NOT_FOUND') {
        subscriptionDetails = (
          <div className='subscribe-details'><h3>Subscription not found!</h3></div>
        )
      } else {
        const viewMap = {}
        viewMap['cancelled'] = (<SubscriptionCancelled key={Utils.guid()} {...this.props} objSubscription={objSubscription} assignSubscription={() => this.assignSubscription(objSubscription)} />)
        viewMap['trial'] = (<SubscriptionTrailing key={Utils.guid()} {...this.props} objSubscription={objSubscription} assignSubscription={() => this.assignSubscription(objSubscription)} />)
        viewMap['overdue'] = (<SubscriptionOverdue key={Utils.guid()} {...this.props} objSubscription={objSubscription} assignSubscription={() => this.assignSubscription(objSubscription)} />)
        viewMap['pending'] = (<SubscriptionPending key={Utils.guid()} {...this.props} objSubscription={objSubscription} />)
        viewMap['active'] = (<SubscriptionActive key={Utils.guid()} {...this.props} objSubscription={objSubscription} assignSubscription={() => this.assignSubscription(objSubscription)} />)
        if (typeof viewMap[objSubscription.status] !== 'undefined') {
          subscriptionDetails = viewMap[objSubscription.status]
        }
      }
      return (
        <div className='subscribe-wrapper'>
          <div className='breadcrumb'>
            <a href='/' className='passed'>Home</a> <i className='fa fa-chevron-right' />
            <a href='/subscription' className='passed'>My Subscription</a> <i className='fa fa-chevron-right' />
            <a href='javascript:void(0)' className='active'>Subscription Details</a>
          </div>
          <div className='container'>{subscriptionDetails}</div>
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
