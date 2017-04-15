import React from 'react'

import API from '../../../helpers/api'
import Utils from '../../../helpers/utils'

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
    API.getSubscriptionDetails(this.state.id).then((subscription) => this.setState({ subscription })).catch(() => this.setState({ subscription: Utils.copy(this.initialSubscription) }))
  }

  render() {
    var objSubscription = this.state.subscription
    console.log(objSubscription)
    if (objSubscription.msg != undefined && objSubscription.msg == 'SUBSCRIPTION_NOT_FOUND') {
      var subscriptionDetails = (
        <div className='subscribe-wrapper'>
          <div className='breadcrumb'>
            <a href='Home' className='passed'>Home</a> <i className='fa fa-chevron-right' />
            <a href='Home' className='passed'>My Subscription</a> <i className='fa fa-chevron-right' />
            <a href='Home' className='active'>Subscription Details</a>
          </div>
          <div className='subscribe-details'><h3>Subscription not found!</h3></div>
        </div>
      )
    } else {
      const moment = require('moment');
      if (objSubscription.status == 'cancelled') {
        var subscriptionDetails = (
          <div className='subscribe-details'>
            <h1>Math <span className='status status-cancelled'>Cancelled</span></h1>
            <h3>Subscription details</h3>
            <div className='info'>
              <div className='row'>
                <div className='col-sm-6 col-xs-12'>
                  <div>ID: {objSubscription._id}</div>
                  <div>Plan: <span className='dk-blue'>{objSubscription.courseTitles.join(' & ')} (${parseFloat(objSubscription.fee).toFixed(2)}/{objSubscription.expirationType == 'annually' ? 'month' : 'year'})</span></div>
                  <div>Payment method: {objSubscription.channel == 'bank' ? 'Bank Transfer' : 'VISA ******' + objSubscription.ccnum}</div>
                </div>
                <div className='col-sm-6 col-xs-12'>
                  <div>Ended at: {moment.unix(objSubscription.expiryDate / 1000).format("MMM D YYYY")}</div>
                  <div>Created: {moment.unix(objSubscription.dateCreated / 1000).format("MMM D YYYY")}</div>
                </div>
              </div>
            </div>

            <h3>Student's info</h3>
            <div className='info'>
              <div className='row'>
                <div className='col-sm-6 col-xs-12'>
                  <div>Name: David Potter</div>
                  <div>Email: <a href='mailto:davidpotter@gmail.com'>davidpotter@gmail.com</a></div>
                  <div>Year of Birth: 2007</div>
                </div>
                <div className='col-sm-6 col-xs-12'>
                  <div>School: Primary school of Singapore</div>
                  <div>Grade: not specified</div>
                </div>
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
      } else {
        return (<p>default here</p>)
      }

      return (
        <div className='subscribe-wrapper'>
          <div className='breadcrumb'>
            <a href='Home' className='passed'>Home</a> <i className='fa fa-chevron-right' />
            <a href='Home' className='passed'>My Subscription</a> <i className='fa fa-chevron-right' />
            <a href='Home' className='active'>Subscription Details</a>
          </div>
          {subscriptionDetails}
        </div>
      )
    }
  }

}

PageContent.propTypes = {}

export default PageContent
