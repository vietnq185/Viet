import React from 'react'

class StepNav extends React.Component {
  change (step) {
    this.props.changeStep(step)
  }
  render () {
    const { step, steps } = this.props
    return (
      <div className='subscribe-steps-nav'>
        <ul>
          <li onClick={() => this.change(steps.signIn)} className={['list-inline', [steps.signIn, steps.signUp].indexOf(step) !== -1 ? 'active' : ''].join(' ')}>
            <span className='num-step-container'><span className='num-step'>1</span></span>
            <span className='step-title hidden-xs'>ACCOUNT<span className='step-title-desc'>Sign In or Sign Up</span></span>
          </li>
          <li onClick={() => this.change(steps.plan)} className={['list-inline', (step === steps.plan) ? 'active' : ''].join(' ')}>
            <span className='num-step-container'><span className='num-step'>2</span></span>
            <span className='step-title hidden-xs'>PLAN<span className='step-title-desc'>Select a plan</span></span>
          </li>
          <li onClick={() => this.change(steps.payment)} className={['list-inline', (step === steps.payment) ? 'active' : ''].join(' ')}>
            <span className='num-step-container'><span className='num-step'>3</span></span>
            <span className='step-title hidden-xs'>PAYMENT<span className='step-title-desc'>Complete your payment</span></span>
          </li>
          <li onClick={() => this.change(steps.linkStudent)} className={['list-inline', [steps.createStudent, steps.linkStudent].indexOf(step) !== -1 ? 'active' : ''].join(' ')}>
            <span className='num-step-container'><span className='num-step'>4</span></span>
            <span className='step-title hidden-xs'>STUDENT<span className='step-title-desc'>Assign plan to a student</span></span>
          </li>
        </ul>
      </div>
    )
  }
}

StepNav.propTypes = {
  step: React.PropTypes.string.isRequired,
  steps: React.PropTypes.object.isRequired,
  changeStep: React.PropTypes.func.isRequired
}

export default StepNav
