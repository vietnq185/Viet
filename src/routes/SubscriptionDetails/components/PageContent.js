/* eslint-disable */
import React from 'react'

import API from '../../../helpers/api'
import Utils from '../../../helpers/utils'
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
    API.getSubscriptionDetails(this.state.id).then((subscription) => this.setState({ subscription })).catch((error) => {
      console.info('what the error: ', error)
      self.setState({ subscription: Utils.copy(self.initialSubscription) })
    })
  }

  assignSubscription(item) {
    this.props.restart()
    this.props.subscriptionResult({ success: false, result: item, err: null })
    this.props.assignStudent({ subscriptionId: item._id })
    this.props.changeStep(this.props.subscribe.steps.linkStudent)
    Utils.redirect('/subscribe')
  }

  render() {
    var objSubscription = this.state.subscription
    console.log(objSubscription)
    let subscriptionDetails = ''
    if (objSubscription.msg != undefined && objSubscription.msg == 'SUBSCRIPTION_NOT_FOUND') {
      subscriptionDetails = (
        <div className='subscribe-details'><h3>Subscription not found!</h3></div>
      )
    } else {
      const viewMap = {}
      viewMap['cancelled'] = (<SubscriptionCancelled key={Utils.guid()} {...this.props} objSubscription={objSubscription} assignSubscription={() => this.assignSubscription(objSubscription)} />)
      viewMap['trailing'] = (<SubscriptionTrailing key={Utils.guid()} {...this.props} objSubscription={objSubscription} assignSubscription={() => this.assignSubscription(objSubscription)} />)
      viewMap['overdue'] = (<SubscriptionOverdue key={Utils.guid()} {...this.props} objSubscription={objSubscription} assignSubscription={() => this.assignSubscription(objSubscription)} />)
      viewMap['pending'] = (<SubscriptionPending key={Utils.guid()} {...this.props} objSubscription={objSubscription} />)
      viewMap['active'] = (<SubscriptionActive key={Utils.guid()} {...this.props} objSubscription={objSubscription} assignSubscription={() => this.assignSubscription(objSubscription)} />)
      if (typeof viewMap[objSubscription.status] !== 'undefined') {
        subscriptionDetails = viewMap[objSubscription.status]
      } else {
        /*subscriptionDetails = (
          <div className='subscribe-details'><h3>Subscription not found!</h3></div>
        )*/
      }
    }
    return (
      <div className='subscribe-wrapper'>
        <div className='breadcrumb'>
          <a href='/' className='passed'>Home</a> <i className='fa fa-chevron-right' />
          <a href='/subscription' className='passed'>My Subscription</a> <i className='fa fa-chevron-right' />
          <a href='javascript:void(0)' className='active'>Subscription Details</a>
        </div>
        {subscriptionDetails}
      </div>
    )
  }

}

PageContent.propTypes = {}

export default PageContent
