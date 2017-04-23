/* eslint-disable */
import React from 'react'
import { fadeIn } from 'react-animations'
import { StyleSheet, css } from 'aphrodite'

import constants from '../../../constants'
import Utils from '../../../helpers/utils'
import validate from '../../../helpers/validate'
import FailImage from '../../../styles/images/icon-failed.png'

const MONTHLY = constants.frequency.monthly
const ANNUALLY = constants.frequency.annually

const BANK_TRANSFER = constants.paymentMethod.bankTransfer
const CREDIT_CARD = constants.paymentMethod.creditCard

const styles = StyleSheet.create({
  fadeIn: {
    animationName: fadeIn,
    animationDuration: '1s'
  }
})

class UpgradeSubscriptionDetails extends React.Component {
  render () {
    const { objSubscription } = this.props
    return (
      <div className='subscribe-details'>
          <div className='alert alert-success'>
            <p>Looks like you've already enjoyed monthly Math plan. Your plan will be upgraded from <strong>Monthly Plan</strong> to <strong>Annually Plan</strong>. Thus, please review your upgrade plan and select a payment method, or contact us at (65) 231-21221 for help.</p>
            <br />
            <p>For the plan which is on trial, it will be applied right after you upgrade successfully.</p>
            <p>For the plan which is active, it will be applied right after the current subscription ends its current cycle.</p>
          </div>
          <div className='upgrade-plan-container'>
            <div className='plan-details'>
              <h1>1. Review Upgrade Plan</h1>
              <div className='table-responsive'>
                <table className='table'>
                  <thead>
                    <tr>
                      <th>&nbsp;</th>
                      <th>Plan</th>
                      <th>Period</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Current Plan</td>
                      <td>Math</td>
                      <td>Monthly</td>
                      <td>${objSubscription.fee}</td>
                    </tr>
                    <tr className='upgrade'>
                      <td>Upgrade</td>
                      <td>Math</td>
                      <td>Annually</td>
                      <td>${objSubscription.fee * 12}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className='payment-method'>
              <h1>2. Select Payment Method</h1>
              <div className='payment-method-form'>
                <form action='' method='post'>
                  <ul className='list-inline'>
                    <li>
                      <input type='radio' name='payment_method' id='cc' value='cc' />
                      <label htmlFor='cc'><i className='fa fa-credit-card' aria-hidden='true' />Credit/Debit Card</label>
                    </li>
                    <li>
                      <input type='radio' name='payment_method' id='bank' value='bank' />
                      <label htmlFor='bank'><i className='fa fa-money' aria-hidden='true' />Bank Transfer</label>
                    </li>
                  </ul>
                  <div className='cc-container'>
                    <ul className='list-inline'>
                      <li>
                        <input type='radio' name='card_id' id='card_id_1' value='1' />
                        <label htmlFor='card_id_1'><span>VISA</span> ****4242 02/2020</label>
                      </li>
                      <li>
                        <input type='radio' name='card_id' id='card_id_2' value='2' />
                        <label htmlFor='card_id_2'><span>Master Card</span> ****4242 02/2020</label>
                      </li>
                      <li>
                        <input type='radio' name='card_id' id='card_id_3' value='new' />
                        <label htmlFor='card_id_3'>Add new card</label>
                      </li>
                    </ul>
                    <div className='cc-details'>
                      <div className='row'>
                        <div className='col-sm-6 col-xs-12'>
                          <div className='form-group'>
                            <label htmlFor='contact-name'>Card Number</label>
                            <input className='form-control' name='card_number' id='card_number' required='' type='text' />
                          </div>
                        </div>
                        <div className='col-sm-6 col-xs-12'>
                          <div className='form-group'>
                            <label htmlFor='contact-name'>Name</label>
                            <input className='form-control' name='name' id='name' required='' type='text' />
                          </div>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-sm-4 col-xs-12'>
                          <div className='form-group'>
                            <label htmlFor='contact-name'>Expiry Month</label>
                            <select className='form-control' name='exp_month' id='exp_month' required=''>
                              <option value='01'>01</option>
                              <option value='02'>02</option>
                              <option value='03'>03</option>
                              <option value='04'>04</option>
                              <option value='05'>05</option>
                              <option value='06'>06</option>
                              <option value='07'>07</option>
                              <option value='08'>08</option>
                              <option value='09'>09</option>
                              <option value='10'>10</option>
                              <option value='11'>11</option>
                              <option value='12'>12</option>
                            </select>
                          </div>
                        </div>
                        <div className='col-sm-4 col-xs-12'>
                          <div className='form-group'>
                            <label htmlFor='contact-name'>Expiry Year</label>
                            <select className='form-control' name='exp_year' id='exp_year' required=''>
                              <option value='2017'>2017</option>
                              <option value='2018'>2018</option>
                              <option value='2019'>2019</option>
                              <option value='2020'>2020</option>
                            </select>
                          </div>
                        </div>
                        <div className='col-sm-4 col-xs-12'>
                          <div className='form-group'>
                            <label htmlFor='contact-name'>CVV</label>
                            <input className='form-control' name='cvv' id='cvv' required='' type='text' />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='bank-container'>
                    <p>If you select "Bank Transfer" you can only start the trial period after your account is activated by us. We will call you to confirm the information and we will provide you further instruction via your email address as well.</p>
                    <p>For instant information, please contact us via +65 7432 3421<br />You will skip step 4 if you select this payment method</p>
                  </div>
                  <br />
                  <div className='form-group'>
                    <button type='button' className='btn dk-bg-blue dk-white btnCompleteSubscription'>Confirm Upgrading</button>
                    <span className='secure-server'><i className='fa fa-lock ' /> Secure Server</span>
                  </div>
                </form>
                <div id='modalPaymentFailed' className='modal fade' role='dialog'>
                  <div className='modal-dialog'>

                    <div className='modal-content'>
                      <div className='modal-body text-center'>
                        <div><img src={FailImage} /></div>
                        <h1>FAILED!</h1>
                        <p>Sorry, an error has occured.<br />Please check your payment detail and try again. Thank you!</p>
                        <div><button className='btn dk-bg-green dk-white btn-close-modal' type='button' data-dismiss='modal'>Try Again</button></div>
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

UpgradeSubscriptionDetails.propTypes = {
}

export default UpgradeSubscriptionDetails
