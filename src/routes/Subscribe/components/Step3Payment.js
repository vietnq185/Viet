import React from 'react'

import constants from '../../../constants'
import Utils from '../../../helpers/utils'

import FailImage from '../../../styles/images/icon-failed.png'

const MONTHLY = constants.frequency.monthly
const ANNUALLY = constants.frequency.annually

const BANK_TRANSFER = constants.paymentMethod.bankTransfer
const CREDIT_CARD = constants.paymentMethod.creditCard

class Step3Payment extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      paymentMethod: this.props.paymentMethod,
      selectedCardId: this.props.selectedCardId || ''
    }
  }

  render () {
    const self = this

    console.info('Subscribe => PageContent => Payment component => props: ', this.props)
    console.info('Subscribe => PageContent => Payment component => state: ', this.state)

    const { applyDiscount, discountPercent, selectedPlan } = this.props // eslint-disable-line
    let { frequency, fee } = selectedPlan
    fee = isNaN(fee) ? 0 : (applyDiscount ? (fee - fee * discountPercent / 100) : fee)
    //
    const cardList = []
    let hasChecked = false
    for (let i = 0; i < this.props.cclist.length; i++) {
      const ccitem = this.props.cclist[i]
      hasChecked = this.state.selectedCardId === ccitem._id
      cardList.push(
        <li key={ccitem._id}>
          {this.state.selectedCardId === ccitem._id ? (
            <input type='radio' name='card_id' id={ccitem._id} value={ccitem._id} defaultChecked onChange={() => self.setState({ selectedCardId: ccitem._id })} />
          ) : (
            <input type='radio' name='card_id' id={ccitem._id} value={ccitem._id} onChange={() => self.setState({ selectedCardId: ccitem._id })} />
          )}&nbsp;
          <label htmlFor={ccitem._id}>
            <span>{ccitem.holderName}</span> {ccitem.ccnum} {ccitem.ccmonth}/{ccitem.ccyear}
          </label>
        </li>
      )
    }
    cardList.push(
      <li key='new'>
        {!hasChecked ? (
          <input type='radio' name='card_id' id='card_id_new' value='new' defaultChecked onChange={() => self.setState({ selectedCardId: '' })} />
        ) : (
          <input type='radio' name='card_id' id='card_id_new' value='new' onChange={() => self.setState({ selectedCardId: '' })} />
        )}&nbsp;
        <label htmlFor='card_id_new'>
          Add new card
        </label>
      </li>
    )
    //

    return (
      <div className='subscription-complete-payment'>
        <div className='row'>
          <div className='col-sm-9 col-xs-12'>
            <h2>Select your payment method</h2>
          </div>
          <div className='col-sm-3 col-xs-12 text-right'>
            <a href='javascript: void(0);' onClick={() => this.props.changeStep(this.props.steps.plan)} className='change-plan'>Change plan</a>
          </div>
        </div>
        <hr />
        <div className='payment-method'>
          <div className={this.state.paymentMethod === CREDIT_CARD ? 'cc-container' : 'hide'}>
            <div>Your credit card will not be charged until the 14 days trial period expires. If you cancel the subscription before the trial expired, your card will not be charged.</div>
            <div>After your trial period you will be charged <strong>{frequency === MONTHLY ? (<abbr>${fee} per month</abbr>) : (<abbr>${fee * 12} per year</abbr>)}</strong></div><br />
          </div>
          <div className={this.state.paymentMethod === BANK_TRANSFER ? 'bank-container' : 'hide'}>
            <h3>After your trial period you will be charged <strong>{frequency === MONTHLY ? (<abbr>${fee} per month</abbr>) : (<abbr>${fee * 12} per year</abbr>)}:</strong></h3>
          </div>
          <div className='payment-method-form'>
            <form action='' method='post'>
              <ul className='list-inline'>
                <li onClick={() => this.setState({ paymentMethod: CREDIT_CARD })}>
                  {this.state.paymentMethod === CREDIT_CARD ? (<input type='radio' name='payment_method' id='cc' value={CREDIT_CARD} defaultChecked />) : (<input type='radio' name='payment_method' id='cc' value={CREDIT_CARD} />)}
                  <label htmlFor='cc'><i className='fa fa-credit-card' aria-hidden='true' />Credit/Debit Card</label>
                </li>
                <li onClick={() => this.setState({ paymentMethod: BANK_TRANSFER })}>
                  {this.state.paymentMethod === BANK_TRANSFER ? (<input type='radio' name='payment_method' id='bank' value={BANK_TRANSFER} defaultChecked />) : (<input type='radio' name='payment_method' id='bank' value={BANK_TRANSFER} />)}
                  <label htmlFor='bank'><i className='fa fa-money' aria-hidden='true' />Bank Transfer</label>
                </li>
              </ul>
              <div className={this.state.paymentMethod === CREDIT_CARD ? 'cc-container' : 'hide'}>
                <ul className='list-inline'>
                  {cardList}
                </ul>
                <div className={this.state.selectedCardId.length === 0 ? 'cc-details' : 'hide'}>
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
              <div className={this.state.paymentMethod === BANK_TRANSFER ? 'bank-container' : 'hide'}>
                <p>If you select "Bank Transfer" you can only start the trial period after your account is activated by us. We will call you to confirm the information and we will provide you further instruction via your email address as well.</p>
                <p>For instant information, please contact us via +65 7432 3421<br />You will skip step 4 if you select this payment method</p>
              </div>
              <br />
              <div className='form-group'>
                <button type='button' className='btn dk-bg-blue dk-white btnCompleteSubscription'>Complete Subscription</button>
                <span className='secure-server'><i className='fa fa-lock ' /> Secure Server</span>
              </div>
            </form>

            {/* <!-- Modal --> */}
            <div id='modalPaymentFailed' className='modal fade' role='dialog'>
              <div className='modal-dialog'>

                {/* <!-- Modal content--> */}
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
    )
  }
}

Step3Payment.propTypes = {
  steps: React.PropTypes.object.isRequired,
  changeStep: React.PropTypes.func.isRequired,
  selectedPlan: React.PropTypes.object.isRequired,
  paymentMethod: React.PropTypes.string.isRequired,
  cclist: React.PropTypes.array,
  selectedCardId: React.PropTypes.string
}

export default Step3Payment
