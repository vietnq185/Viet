import React from 'react'
import ToggleLeftImage from '../../../styles/images/fa-toggle-left.png'
import ToggleRightImage from '../../../styles/images/fa-toggle-right.png'

class Step1SignIn extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  render () {
    console.info('Subscribe => PageContent => SignIn component => props: ', this.props)
    return (
      <div className='subscription-plan'>
        <h3>Pickup your subscription plan</h3>
        <div className='discount-info'>DISCOUNT 20% for the first 200 subscriptions</div>

        <div className='row'>
          <div className='col-md-4 col-sm-6 col-xs-12'>
            <div className='subscription-plan-item'>
              <div className='subscription-subjects'>
                <h2>Math</h2>
                <div className='subscription-subjects-desc'>You can learn all about Measurement, Algebra, Geometry, Statistics, Numbers and more...</div>
                <ul className='list-inline subscription-subjects-details'>
                  <li><i className='fa fa-check-circle-o' aria-hidden='true' />Unlock 10 more premium Worksheets</li>
                  <li><i className='fa fa-check-circle-o' aria-hidden='true' />24/7 support from teacher</li>
                  <li><i className='fa fa-check-circle-o' aria-hidden='true' />Hints available at any questions</li>
                </ul>
              </div>
              <hr />
              <div className='subscription-payment'>
                <div className='subscription-payment-type'>Monthly <span className='fa-toggle'><img src={ToggleRightImage} /></span> Annually</div>
                <div className='subscription-price'><sup>$</sup><span className='price'>48</span></div>
                <div className='subscription-price-before-discount'>$60</div>
                <div className='subscription-price-per'>per month</div>
                <a className='start-your-trial'>Start your free 14 day trial</a>
              </div>
            </div>
          </div>
          <div className='col-md-4 col-sm-6 col-xs-12'>
            <div className='subscription-plan-item'>
              <div className='subscription-subjects'>
                <h2>Science</h2>
                <div className='subscription-subjects-desc'>You can learn all about Cycles, Intractions, Diversity, Enger, System and more...</div>
                <ul className='list-inline subscription-subjects-details'>
                  <li><i className='fa fa-check-circle-o' aria-hidden='true' />Unlock 10 more premium Worksheets</li>
                  <li><i className='fa fa-check-circle-o' aria-hidden='true' />24/7 support from teacher</li>
                  <li><i className='fa fa-check-circle-o' aria-hidden='true' />Hints available at any questions</li>
                </ul>
              </div>
              <hr />
              <div className='subscription-payment'>
                <div className='subscription-payment-type'>Monthly <span className='fa-toggle'><img src={ToggleLeftImage} /></span> Annually</div>
                <div className='subscription-price'><sup>$</sup><span className='price'>48</span></div>
                <div className='subscription-price-before-discount'>$60</div>
                <div className='subscription-price-per'>per month</div>
                <a className='start-your-trial'>Start your free 14 day trial</a>
              </div>
            </div>
          </div>
          <div className='col-md-4 col-sm-6 col-xs-12'>
            <div className='subscription-plan-item'>
              <div className='subscription-subjects'>
                <h2>Math &amp; Science</h2>
                <div className='subscription-subjects-desc'>You can learn all concepts about Math &amp; Science</div>
                <ul className='list-inline subscription-subjects-details'>
                  <li><i className='fa fa-check-circle-o' aria-hidden='true' />Unlock 10 more premium Worksheets</li>
                  <li><i className='fa fa-check-circle-o' aria-hidden='true' />24/7 support from teacher</li>
                  <li><i className='fa fa-check-circle-o' aria-hidden='true' />Hints available at any questions</li>
                </ul>
              </div>
              <hr />
              <div className='subscription-payment'>
                <div className='subscription-payment-type'>Monthly <span className='fa-toggle'><img src={ToggleRightImage} /></span> Annually</div>
                <div className='subscription-price'><sup>$</sup><span className='price'>80</span></div>
                <div className='subscription-price-before-discount'>$100</div>
                <div className='subscription-price-per'>per month</div>
                <a className='start-your-trial'>Start your free 14 day trial</a>
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
