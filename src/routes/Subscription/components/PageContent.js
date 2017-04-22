/* eslint-disable */
import React from 'react'
import { IndexLink } from 'react-router'
import moment from 'moment'

import constants from '../../../constants'
import Utils from '../../../helpers/utils'

const MONTHLY = constants.frequency.monthly
const ANNUALLY = constants.frequency.annually

const BANK_TRANSFER = constants.paymentMethod.bankTransfer
const CREDIT_CARD = constants.paymentMethod.creditCard

class PageContent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {
    this.getList(1)
  }

  getList(page) {
    this.props.getSubscriptionList(page)
    this.props.scrollTo()
  }

  updateSubscription(id) {

  }

  cancelSubscription(id) {

  }

  assignSubscription(item) {
    this.props.restart()
    this.props.subscriptionResult({ success: false, result: item, err: null })
    this.props.assignStudent({ subscriptionId: item._id })
    this.props.changeStep(this.props.subscribe.steps.linkStudent)
    Utils.redirect('/subscribe')
  }

  render() {
    console.info('Subscription => PageContent component => props: ', this.props)

    return (
      <div className='subscribe-wrapper'>
        <div className='breadcrumb'>
          <IndexLink to='/' className='passed'>Home</IndexLink> <i className='fa fa-chevron-right' />
          <span className='active'>My Subscription</span>
        </div>
        <div className='my-subscription'>
          <h1>My Subscription</h1>
          <div className='row'>
            <div className='col-sm-6 col-xs-12'>
              Total {this.props.list.subscriptions.length} subscription(s)
          </div>
            <div className='col-sm-6 col-xs-12 text-right'>
              <a href='javascript: void(0);' className='btn dk-bg-light-green dk-white' onClick={() => Utils.redirect('/subscribe')}>+ Subscribe More</a>
            </div>
          </div><br />
          <div className='table-responsive'>
            <table className='table tbl-subscriptions'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Plan</th>
                  <th>Price</th>
                  <th>Created</th>
                  <th>Next Payment</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {this.props.list.subscriptions.map(item => { // eslint-disable-line
                  let isAnnually = (item.expirationType === ANNUALLY)
                  let theRate = isAnnually ? 12 : 1
                  let theLabel = isAnnually ? 'year' : 'month'
                  let buttonsPanel = []
                  if (item.status === 'active' || item.status === 'trailing') {
                    if (!isAnnually) {
                      buttonsPanel.push(<a key={Utils.guid()} className='link-upgrade-subscription' href='javascript: void(0);' onClick={() => this.updateSubscription(item._id)}>Upgrade</a>)
                    }
                    buttonsPanel.push(<a key={Utils.guid()} className='link-cancel-subscription' href='javascript: void(0);' onClick={() => this.cancelSubscription(item._id)}>Cancel</a>)
                    if ((item.studentId || '').length === 0) {
                      buttonsPanel.push(<a key={Utils.guid()} className='link-assign-student' href='javascript: void(0);' onClick={() => this.assignSubscription(item)}>Assign</a>)
                    }
                  }
                  return (
                    <tr key={item._id}>
                      <td className={'dk-blue-text'}><a className={'dk-blue-text'} href='javascript: void(0);' onClick={() => Utils.redirect(`/subscription-details/${item._id}`)}>#{item._id.substring(0, 7)}...</a></td>
                      <td>{item.courseTitles.join(' & ')}</td>
                      <td>${item.fee * theRate}/{theLabel} <span className='payment-method'>via {item.channel === constants.paymentMethod.creditCard ? 'Credit Card' : item.channel}</span></td>
                      <td>{moment.unix(item.dateCreated / 1000).format('MMM D, YYYY')}</td>
                      <td>{moment.unix(item.expiryDate / 1000).format('MMM D, YYYY')}</td>
                      <td><span className={`subscribe-status subscribe-status-${item.status}`}>{Utils.ucfirst(item.status)}</span></td>
                      <td>{buttonsPanel}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className='row'>
            <div className='col-xs-12 text-right'>
              <ul className='list-inline subscriptions-paging'>
                {Utils.range(1, this.props.list.totalPages).map(page => { // eslint-disable-line
                  return (
                    <li key={`page${page}`} className='active'><a href='javascript: void(0);' onClick={() => this.getList(page)}>{page}</a></li>
                  )
                })}
              </ul>
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
      </div>
    )
  }
}

PageContent.propTypes = {
}

export default PageContent
