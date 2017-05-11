/* eslint-disable */
import React from 'react'
import { fadeIn } from 'react-animations'
import { StyleSheet, css } from 'aphrodite'
import ReactTooltip from 'react-tooltip'
import constants from '../../../constants'
import Utils from '../../../helpers/utils'
import API from '../../../helpers/api'
import validate from '../../../helpers/validate'
import * as authActions from '../../../store/auth'
import FailImage from '../../../styles/images/icon-failed.png'
import SuccessImage from '../../../styles/images/icon-success.png'

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

  constructor(props) {
    super(props)
    const { objSubscription } = this.props
    this.initialErrors = {
      name: '',
      ccnum: '',
      ccmonth: '',
      ccyear: '',
      cvv: ''
    }
    this.errors = Utils.copy(this.initialErrors)
    this.state = {
      cclist: [],
      paymentMethod: (objSubscription.channel === BANK_TRANSFER ? BANK_TRANSFER : CREDIT_CARD),
      selectedCardId: objSubscription.cardId || '',
      newCC: {},
      hasError: false,
      errMsg: '',
      showFailedDialog: false,
      showSuccessDialog: false,
    }
  }

  resetErrors() {
    this.errors = Utils.copy(this.initialErrors)
    this.setState({ hasError: false })
  }

  setErrors(errors) {
    this.errors = errors
    this.setState({ hasError: true })
  }

  viewSubscriptionDetails(id) {
    Utils.redirect(`/subscription-details/${id}`)
  }

  setNewCC(key, value) {
    const obj = {}
    obj[key] = value
    this.setState({ newCC: Utils.merge(this.state.newCC, obj) })
  }

  doUpgradeSubscription() {
    var self = this
    const { auth: { jwt } } = this.props
    const { objSubscription } = this.props
    const { paymentMethod, selectedCardId, newCC } = this.state
    //
    const subData = {
      _id: objSubscription._id,
      channel: paymentMethod,
      parentId: jwt.userId,
      isUpgradePlan: 1
    }
    if (paymentMethod !== BANK_TRANSFER) {
      subData.cardId = selectedCardId
      if (selectedCardId.length === 0) {
        // add new card
        subData.addCard = 1
        subData.card_name = newCC.name
        subData.ccnum = newCC.ccnum
        subData.ccmonth = newCC.ccmonth
        subData.ccyear = newCC.ccyear
        subData.cvv = newCC.cvv
      }
    }
    //
    API.upgradeSubscription(jwt.accessToken || '', subData).then(result => {
      console.info('upgrade result: ', result);
      if (result.stripeStatus === 'OK') {
        this.setState({
          showFailedDialog: false,
          showSuccessDialog: true
        })
      } else {
        this.setState({
          showFailedDialog: true,
          showSuccessDialog: false
        })
      }

    }).catch(errMsg => {
      console.info('upgrade error: ', errMsg);
      this.setState({
        showFailedDialog: true,
        showSuccessDialog: false
      })
    });
  }

  onSubmit() {
    // need to validate cc info in case create new cc
    const needValidate = this.state.paymentMethod !== BANK_TRANSFER && this.state.selectedCardId.length === 0

    if (!needValidate) {
      return this.doUpgradeSubscription()
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
      this.doUpgradeSubscription()
    }
    else {
      this.setErrors(result)
    }

  }

  componentDidMount() {
    var self = this
    const { auth } = this.props
    API.getCCList(auth.jwt.accessToken || '', auth.jwt.userId || '').then((cclist) => this.setState({ cclist })).catch((error) => {
      self.setState({ cclist: [] })
    })
  }

  render() {
    const { objSubscription } = this.props
    return (
      <div className='subscribe-details' >
        <div className='alert alert-success'>
          <p>Looks like you've already enjoyed monthly {(objSubscription.courseTitles || []).join(' & ')} plan. Your plan will be upgraded from <strong>Monthly Plan</strong> to <strong>Annually Plan</strong>. Thus, please review your upgrade plan and select a payment method, or contact us at (65) 231-21221 for help.</p>
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
                    <td>{(objSubscription.courseTitles || []).join(' & ')}</td>
                    <td>Monthly</td>
                    <td>${objSubscription.fee}</td>
                  </tr>
                  <tr className='upgrade'>
                    <td>Upgrade</td>
                    <td>{(objSubscription.courseTitles || []).join(' & ')}</td>
                    <td>Annually</td>
                    <td>${objSubscription.fee * 12}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {this.renderPaymentForm()}

        </div>
      </div >
    )
  }

  renderPaymentForm() {
    const self = this
    const { objSubscription } = this.props
    console.info('Upgrade details component => props: ', this.props)
    console.info('Upgrade details component => state: ', this.state)

    const requiredLabel = (<abbr className='dk-red-text'>&nbsp;*</abbr>)

    //
    const cardList = []
    let hasChecked = false
    let numCCList = this.state.cclist.length || 0
    for (let i = 0; i < this.state.cclist.length; i++) {
      const ccitem = this.state.cclist[i]
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

    return (
      <div className='payment-method'>
        <div className='payment-method-form'>
          <form action='' method='post'>
            <ul className='list-inline'>
              <li onClick={() => this.setState({ paymentMethod: CREDIT_CARD })}>
                {this.state.paymentMethod === CREDIT_CARD ? (<input type='radio' name='payment_method' id='cc' value={CREDIT_CARD} defaultChecked />) : (<input type='radio' name='payment_method' id='cc' value={CREDIT_CARD} />)}
                <label htmlFor='cc'><i className='fa fa-credit-card' aria-hidden='true' />Credit/Debit Card</label>
              </li>
            </ul>
            <div className={this.state.paymentMethod === CREDIT_CARD ? 'cc-container' : 'hide'}>
              <ul className='list-inline'>
                {cardList}
              </ul>
              <div className={this.state.selectedCardId.length === 0 || numCCList === 0 ? 'cc-details' : 'hide'}>
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
                      <label htmlFor='contact-name'>CVV{requiredLabel}<span className='cvv-info'><a href='javascript:void(0);' data-tip="The last 3 digits displayed on the back of your card" data-html={true}><i className='fa fa-question-circle' /></a><ReactTooltip className="cvv-info-tooltip" place="top" type="dark" html={true} /></span></label>
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

          <div id='modalPaymentSuccess' className={['modal fade', this.state.showSuccessDialog ? 'in' : '', css(styles.fadeIn)].join(' ')} role='dialog' style={this.state.showSuccessDialog ? { display: 'block' } : { display: 'none' }}>
            <div className='modal-dialog'>

              {/* <!-- Modal content--> */}
              <div className='modal-content'>
                <div className='modal-body text-center'>
                  <div><img src={SuccessImage} /></div>
                  <h1>SUCCESS!</h1>
                  <p>You have successfully upgraded the plan.</p>
                  <p>You can view the new subscription in the link below</p>
                  <div><button className='btn dk-bg-green dk-white' type='button' onClick={() => this.viewSubscriptionDetails(objSubscription._id)}>View Subscription Details</button></div>
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
