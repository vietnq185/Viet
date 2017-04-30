/* eslint-disable */
import React from 'react'
import Utils from '../../../helpers/utils'
import API from '../../../helpers/api'
import * as authActions from '../../../store/auth'
import UpgradeSubscriptionDetails from './UpgradeSubscriptionDetails'

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

  render() {
    if (this.props.auth.isLoggedIn) {
      var objSubscription = this.state.subscription
      let subscriptionDetails = ''
      if (objSubscription.msg !== undefined && objSubscription.msg === 'SUBSCRIPTION_NOT_FOUND') {
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
