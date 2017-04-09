import React from 'react'

import FailImage from '../../../styles/images/icon-failed.png'

class Step1SignIn extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  render () {
    console.info('Subscribe => PageContent => SignIn component => props: ', this.props)
    return (
      <div className='subscription-complete-payment'>
        <div className='row'>
          <div className='col-sm-9 col-xs-12'>
            <h2>Select your payment method</h2>
          </div>
          <div className='col-sm-3 col-xs-12 text-right'>
            <a href='' className='change-plan'>Change plan</a>
          </div>
        </div>
        <hr />
        <div className='payment-method'>
          <div className='cc-container'>
            <div>Your credit card will not be charged until the 14 days trial period expires. If you cancel the subscription before the trial expired, your card will not be charged</div>
            <div>After your trial period you will be charged <strong>$48 per month:</strong></div><br />
          </div>
          <div className='bank-container' style={{ display: 'none' }}>
            <h3>After your trial period you will be charged <strong>$400 per year:</strong></h3>
          </div>
          <div className='payment-method-form'>
            <form action='' method='post'>
              <ul className='list-inline'>
                <li>
                  <input type='radio' name='payment_method' id='cc' value='cc' defaultChecked />
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
                    <input type='radio' name='card_id' id='card_id_3' value='new' defaultChecked />
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
              <div className='bank-container' style={{ display: 'none' }}>
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

Step1SignIn.propTypes = {
  steps: React.PropTypes.object.isRequired,
  changeStep: React.PropTypes.func.isRequired
}

export default Step1SignIn
