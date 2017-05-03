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

class Step3Payment extends React.Component {
  constructor(props) {
    super(props)
    this.initialErrors = {
      name: '',
      ccnum: '',
      ccmonth: '',
      ccyear: '',
      cvv: ''
    }
    this.errors = Utils.copy(this.initialErrors)
    this.state = {
      paymentMethod: this.props.paymentMethod,
      selectedCardId: this.props.selectedCardId || '',
      newCC: this.props.newCC || {},
      hasError: false,
      errMsg: '',
      showFailedDialog: (this.props.subscriptionResult.success === false && this.props.subscriptionResult.error !== null)
    }
  }

  componentWillReceiveProps(nextProps) {
    console.info('Subscribe => PageContent => Payment component => componentWillReceiveProps => nextProps: ', nextProps)
    this.setState({
      paymentMethod: nextProps.paymentMethod,
      selectedCardId: nextProps.selectedCardId || '',
      newCC: nextProps.newCC || {},
      showFailedDialog: (nextProps.subscriptionResult.success === false && nextProps.subscriptionResult.error !== null)
    });
  }

  resetErrors() {
    this.errors = Utils.copy(this.initialErrors)
    this.setState({ hasError: false })
  }

  setErrors(errors) {
    this.errors = errors
    this.setState({ hasError: true })
  }

  setNewCC(key, value) {
    const obj = {}
    obj[key] = value
    this.setState({ newCC: Utils.merge(this.state.newCC, obj) })
  }

  onSubmit() {
    // need to validate cc info in case create new cc
    const needValidate = this.state.paymentMethod !== BANK_TRANSFER && this.state.selectedCardId.length === 0

    if (!needValidate) {
      return this.props.completeSubscription(this.state)
    }

    const self = this

    this.resetErrors()

    const rules = {
      name: {
        required: 'Credit card name is required'
      },
      ccnum: {
        required: 'Card number is required'
      },
      ccmonth: {
        required: 'Expiry month is required'
      },
      ccyear: {
        required: 'Expiry year is required'
      },
      cvv: {
        required: 'CVV is required'
      }
    }

    const result = validate(rules, this.refs)  // result === null -> valid, result === error object -> invalid

    if (result === null) {
      this.props.completeSubscription(this.state)
    }
    else {
      this.setErrors(result)
    }

  }

  render() {
    const self = this

    console.info('Subscribe => PageContent => Payment component => props: ', this.props)
    console.info('Subscribe => PageContent => Payment component => state: ', this.state)

    const requiredLabel = (<abbr className='dk-red-text'>&nbsp;*</abbr>)

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
            <span>{ccitem.name}</span> {ccitem.ccnum} {ccitem.ccmonth}/{ccitem.ccyear}
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
    const ccmonthList = []
    ccmonthList.push(<option key={'ccmonth_empty'} value={''}></option>)
    for (let i = 1; i <= 12; i++) {
      let val = i < 10 ? ('0' + i) : ('' + i)
      let selected = self.state.ccmonth === val
      ccmonthList.push(selected ? <option key={'ccmonth' + val} value={val} selected>{val}</option> : <option key={'ccmonth' + val} value={val}>{val}</option>)
    }

    const curYear = new Date().getFullYear()
    const ccyearList = []
    ccyearList.push(<option key={'ccyear_empty'} value={''}></option>)
    for (let i = curYear; i <= curYear + 10; i++) {
      let val = i
      let selected = self.state.ccyear === val
      ccyearList.push(selected ? <option key={'ccyear' + val} value={val} selected>{val}</option> : <option key={'ccyear' + val} value={val}>{val}</option>)
    }

    let bankTransferOption = (
      <li onClick={() => this.setState({ paymentMethod: BANK_TRANSFER })}>
        {this.state.paymentMethod === BANK_TRANSFER ? (<input type='radio' name='payment_method' id='bank' value={BANK_TRANSFER} defaultChecked />) : (<input type='radio' name='payment_method' id='bank' value={BANK_TRANSFER} />)}
        <label htmlFor='bank'><i className='fa fa-money' aria-hidden='true' />Bank Transfer</label>
      </li>
    )

    if (frequency === MONTHLY) {
      /*bankTransferOption = (
        <li>
          <input type='radio' name='payment_method' id='bank' value={BANK_TRANSFER} disabled />
          <label htmlFor='bank'><i className='fa fa-money' aria-hidden='true' />Bank Transfer</label>
        </li>
      )*/
      bankTransferOption = '';
    }

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
                {bankTransferOption}
              </ul>
              <div className={this.state.paymentMethod === CREDIT_CARD ? 'cc-container' : 'hide'}>
                <ul className='list-inline'>
                  {cardList}
                </ul>
                <div className={this.state.selectedCardId.length === 0 ? 'cc-details' : 'hide'}>
                  <div className='row'>
                    <div className='col-sm-6 col-xs-12'>
                      <div className={['form-group', this.errors.ccnum ? 'has-error' : ''].join(' ')}>
                        <label htmlFor='contact-name'>Card Number{requiredLabel}</label>
                        <input className='form-control' name='ccnum' id='ccnum' required='' type='text' value={this.state.newCC.ccnum} ref='ccnum' onChange={(e) => this.setNewCC('ccnum', e.target.value)} />
                        <span className={[this.errors.ccnum ? 'help-block' : 'hide'].join(' ')}>{this.errors.ccnum}</span>
                      </div>
                    </div>
                    <div className='col-sm-6 col-xs-12'>
                      <div className={['form-group', this.errors.name ? 'has-error' : ''].join(' ')}>
                        <label htmlFor='contact-name'>Name{requiredLabel}</label>
                        <input className='form-control' name='name' id='name' required='' type='text' value={this.state.newCC.name} ref='name' onChange={(e) => this.setNewCC('name', e.target.value)} />
                        <span className={[this.errors.name ? 'help-block' : 'hide'].join(' ')}>{this.errors.name}</span>
                      </div>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-sm-4 col-xs-12'>
                      <div className={['form-group', this.errors.ccmonth ? 'has-error' : ''].join(' ')}>
                        <label htmlFor='contact-name'>Expiry Month{requiredLabel}</label>
                        <select className='form-control' name='ccmonth' id='ccmonth' required='' value={this.state.newCC.ccmonth} ref='ccmonth' onChange={(e) => this.setNewCC('ccmonth', e.target.value)}>
                          {ccmonthList}
                        </select>
                        <span className={[this.errors.ccmonth ? 'help-block' : 'hide'].join(' ')}>{this.errors.ccmonth}</span>
                      </div>
                    </div>
                    <div className='col-sm-4 col-xs-12'>
                      <div className={['form-group', this.errors.ccyear ? 'has-error' : ''].join(' ')}>
                        <label htmlFor='contact-name'>Expiry Year{requiredLabel}</label>
                        <select className='form-control' name='ccyear' id='ccyear' required='' value={this.state.newCC.ccyear} ref='ccyear' onChange={(e) => this.setNewCC('ccyear', e.target.value)}>
                          {ccyearList}
                        </select>
                        <span className={[this.errors.ccyear ? 'help-block' : 'hide'].join(' ')}>{this.errors.ccyear}</span>
                      </div>
                    </div>
                    <div className='col-sm-4 col-xs-12'>
                      <div className={['form-group', this.errors.cvv ? 'has-error' : ''].join(' ')}>
                        <label htmlFor='contact-name'>CVV{requiredLabel}</label>
                        <input className='form-control' name='cvv' id='cvv' required='' type='text' value={this.state.newCC.cvv} ref='cvv' onChange={(e) => this.setNewCC('cvv', e.target.value)} />
                        <span className={[this.errors.cvv ? 'help-block' : 'hide'].join(' ')}>{this.errors.cvv}</span>
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
                <button type='button' className='btn dk-bg-blue dk-white btnCompleteSubscription' onClick={() => this.onSubmit()}>Complete Subscription</button>
                <span className='secure-server'><i className='fa fa-lock ' /> Secure Server</span>
              </div>
            </form>

            {/* <!-- Modal --> */}
            <div id='modalPaymentFailed' className={['modal fade', this.state.showFailedDialog ? 'in' : '', css(styles.fadeIn)].join(' ')} role='dialog' style={this.state.showFailedDialog ? { display: 'block' } : { display: 'none' }}>
              <div className='modal-dialog'>

                {/* <!-- Modal content--> */}
                <div className='modal-content'>
                  <div className='modal-body text-center'>
                    <div><img src={FailImage} /></div>
                    <h1>FAILED!</h1>
                    <p>Sorry, an error has occured.<br />Please check your payment detail and try again. Thank you!</p>
                    <div><button className='btn dk-bg-green dk-white btn-close-modal' type='button' data-dismiss='modal' onClick={() => this.setState({ showFailedDialog: false })}>Try Again</button></div>
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
