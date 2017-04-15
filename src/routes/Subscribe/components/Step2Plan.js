import React from 'react'

import constants from '../../../constants'
import Utils from '../../../helpers/utils'

import ToggleLeftImage from '../../../styles/images/fa-toggle-left.png'
import ToggleRightImage from '../../../styles/images/fa-toggle-right.png'

const MONTHLY = constants.frequency.monthly
const ANNUALLY = constants.frequency.annually

class Step2Plan extends React.Component {
  constructor (props) {
    super(props)
    //
    const obj = {}
    for (let i = 0; i < this.props.plans.length; i++) {
      const id = this.props.plans[i]._id
      if (Utils.isNotEmptyObject(this.props.selectedPlan) && this.props.selectedPlan._id === id) {
        obj[id] = Utils.copy(this.props.selectedPlan)
      } else {
        obj[id] = Utils.copy(this.props.plans[i])
        obj[id].frequency = MONTHLY
      }
    }
    //
    this.state = {
      plans: obj
    }
  }

  changeFrequency (id) {
    const frequency = this.state.plans[id].frequency
    const plans = Utils.copy(this.state.plans)
    plans[id].frequency = (frequency === MONTHLY ? ANNUALLY : MONTHLY)
    this.setState({
      plans
    })
  }

  onSubmit (id) {
    this.props.selectPlan(this.state.plans[id]) // eslint-disable-line
    this.props.changeStep(this.props.steps.payment) // eslint-disable-line
  }

  render () {
    console.info('Subscribe => PageContent => Plan component => props: ', this.props)
    console.info('Subscribe => PageContent => Plan component => state: ', this.state)

    const { applyDiscount, discountPercent } = this.props // eslint-disable-line

    const planList = []

    for (let i = 0; i < this.props.plans.length; i++) { // eslint-disable-line
      const item = this.props.plans[i] // eslint-disable-line
      const frequency = this.state.plans[item._id].frequency
      const fee = (frequency === MONTHLY ? item.fee : (item.fee * 12))
      let pricingContent = (<div className='subscription-price'><sup>$</sup><span className='price'>{fee}</span></div>)
      if (applyDiscount) {
        pricingContent = (
          <div>
            <div className='subscription-price'><sup>$</sup><span className='price'>{fee - fee * discountPercent / 100}</span></div>
            <div className='subscription-price-before-discount'>${fee}</div>
          </div>
        )
      }
      planList.push(
        <div className='col-md-4 col-sm-6 col-xs-12' key={item._id}>
          <div className='subscription-plan-item'>
            <div className='subscription-subjects'>
              <h2>{item.courseTitles.join(' & ')}</h2>
              <div className='subscription-subjects-desc'>{item.description}</div>
              <ul className='list-inline subscription-subjects-details'>
                {(item.keyBenefits || []).map(kb => (
                  <li key={Utils.guid()}><i className='fa fa-check-circle-o' aria-hidden='true' />{kb}</li>
                ))}
              </ul>
            </div>
            <hr />
            <div className='subscription-payment'>
              <div className='subscription-payment-type'>Monthly <span className='fa-toggle'><img src={frequency === MONTHLY ? ToggleLeftImage : ToggleRightImage} onClick={() => this.changeFrequency(item._id)} /></span> Annually</div>
              {pricingContent}
              <div className='subscription-price-per'>{frequency === MONTHLY ? 'per month' : 'per year'}</div>
              <a href='javascript: void(0);' className='start-your-trial' onClick={() => this.onSubmit(item._id)}>Start your free 14 day trial</a>
            </div>
          </div>
        </div>
      )
    }

    const discountPanel = applyDiscount ? (<div className='discount-info'>DISCOUNT 20% for the first 200 subscriptions</div>) : ''

    return (
      <div className='subscription-plan'>
        <h3>Pickup your subscription plan</h3>
        {discountPanel}
        <div className='row'>{planList}</div>
      </div>
    )
  }
}

Step2Plan.propTypes = {
  steps: React.PropTypes.object.isRequired,
  changeStep: React.PropTypes.func.isRequired,
  plans: React.PropTypes.array.isRequired,
  selectedPlan: React.PropTypes.object.isRequired
}

export default Step2Plan
