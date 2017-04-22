/* eslint-disable */
import React from 'react'

import '../../../styles/subscribe.css'

const moment = require('moment')

class SubscriptionPending extends React.Component {
  render () {
    const { objSubscription } = this.props
    let theRate = (objSubscription.expirationType === 'annually' ? 12 : 1)
    return (
      <div className='subscribe-details'>
        <h1>{objSubscription.courseTitles.join(' & ')} <span className='status status-pending'>Pending</span></h1>
        <h3>Subscription details</h3>
        <div className='info'>
          <div className='row'>
            <div className='col-sm-6 col-xs-12'>
              <div>ID: #{objSubscription.refid || objSubscription._id}</div>
              <div>Plan: <span className='dk-blue'>{objSubscription.courseTitles.join(' & ')} (${parseFloat(objSubscription.fee * theRate).toFixed(2)}/{objSubscription.expirationType == 'annually' ? 'year' : 'month'})</span></div>
              <div>Payment method: {objSubscription.channel == 'bank' ? 'Bank Transfer' : 'VISA ******' + objSubscription.ccnum}</div>
            </div>
            <div className='col-sm-6 col-xs-12'>
              <div>Created: {moment.unix(objSubscription.dateCreated / 1000).format('MMM D, YYYY')}</div>
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='col-xs-12 pending-account-info'>
						This account is not activated yet. Please contact us to activate your account.<br />
						If you have already contacted us, we appreciate your patience to allow us to activate the account for you in 2 workings days
					</div>
        </div>

        <div className='row'>
          <div className='col-xs-12'>
            <div className='subcribe-contact-info'>
              <div className='subcribe-contact-info-desc'>
                <p>In case you want to:</p>
                <div className='subcribe-contact-info-desc-options'>
                  <ul className='list-inline'>
                    <li><i className='fa fa-check-circle' aria-hidden='true' />Update your payment information</li>
                    <li><i className='fa fa-check-circle' aria-hidden='true' />Confirm your subscription</li>
                    <li><i className='fa fa-check-circle' aria-hidden='true' />Update your login/ account information</li>
                    <li><i className='fa fa-check-circle' aria-hidden='true' />Renew your subscription</li>
                  </ul>
                </div>
                <div className='row'>
                  <div className='col-xs-12'>
                    Please contact us via: <span className='contact-phone'><i className='fa fa-phone' aria-hidden='true' />+65 0978 2326</span><span className='contact-email'><i className='fa fa-envelope' aria-hidden='true' /><a href='mailto:support@a-sls.com'>support@a-sls.com</a></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    )
  }
}

SubscriptionPending.propTypes = {
}

export default SubscriptionPending
