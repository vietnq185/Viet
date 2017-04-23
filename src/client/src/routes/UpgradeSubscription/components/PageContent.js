/* eslint-disabls */
import React from 'react'
import Utils from '../../../helpers/utils'
import API from '../../../helpers/api'
import UpgradeSubscriptionDetails from './UpgradeSubscriptionDetails'

class PageContent extends React.Component {
  constructor (props) {
    super(props)
    this.initialSubscription = {}
    this.state = {
      id: this.props.params.id || '',
      subscription: Utils.copy(this.initialSubscription)
    }
  }

  componentDidMount () {
    var self = this
    API.getSubscriptionDetails(this.state.id).then((subscription) => this.setState({ subscription })).catch((error) => {
      self.setState({ subscription: Utils.copy(self.initialSubscription) })
    })
  }

  render () {
    var objSubscription = this.state.subscription
    let subscriptionDetails = ''
    if (objSubscription.msg != undefined && objSubscription.msg == 'SUBSCRIPTION_NOT_FOUND') {
      subscriptionDetails = (
        <div className='subscribe-details'><h3>Subscription not found!</h3></div>
      )
    } else {
      subscriptionDetails = (<UpgradeSubscriptionDetails key={Utils.guid()} {...this.props} objSubscription={objSubscription} />)
    }
    return (
      <div className='subscribe-wrapper'>
        <div className='breadcrumb'>
          <a href='/' className='passed'>Home</a> <i className='fa fa-chevron-right' />
          <a href='/subscription' className='passed'>My Subscription</a> <i className='fa fa-chevron-right' />
          <a href='javascript:void(0)' onClick={() => Utils.redirect(`/subscription-details/${objSubscription._id}`)} className='passed'>Subscription Details</a> <i className='fa fa-chevron-right' />
          <a href='javascript:void(0)' className='active'>Upgrade</a>
        </div>
        {subscriptionDetails}
      </div>
    )
  }

}

PageContent.propTypes = {
  step: React.PropTypes.string.isRequired,
  steps: React.PropTypes.object.isRequired
}

export default PageContent
